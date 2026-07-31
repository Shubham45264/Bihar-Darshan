import { prisma as db } from '../../db';
import { CreateCommunityInput, CreateCommunityPostInput } from './community.validation';
import { AppError } from '../../errors/AppError';
import { ApprovalStatus } from '../../db';

// --- Community ---
export const getAllCommunities = async () => {
  return db.community.findMany({
    where: { isActive: true, status: 'APPROVED' },
    include: {
      _count: {
        select: { posts: true, members: true }
      }
    },
    orderBy: { isFeatured: 'desc' }
  });
};

export const getCommunityById = async (id: string) => {
  const community = await db.community.findUnique({
    where: { id },
    include: {
      _count: {
        select: { posts: true, members: true }
      },
      posts: {
        include: { author: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!community) throw new AppError('Community not found', 404);
  return community;
};

export const createCommunity = async (userId: string, data: CreateCommunityInput) => {
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

  return db.community.create({
    data: {
      ...data,
      slug,
      createdBy: userId,
      membersCount: 1, // creator is auto-joined as OWNER
      members: {
        create: {
          userId,
          role: 'OWNER'
        }
      }
    }
  });
};

export const joinCommunity = async (communityId: string, userId: string) => {
  await getCommunityById(communityId);
  return db.$transaction(async (tx) => {
    const member = await tx.communityMember.create({
      data: { communityId, userId, role: 'MEMBER' },
    });
    await tx.community.update({
      where: { id: communityId },
      data: { membersCount: { increment: 1 } },
    });
    return member;
  });
};

export const leaveCommunity = async (communityId: string, userId: string) => {
  return db.$transaction(async (tx) => {
    await tx.communityMember.delete({
      where: { communityId_userId: { communityId, userId } },
    });
    // Decrement but never go below 0
    const community = await tx.community.findUnique({ where: { id: communityId }, select: { membersCount: true } });
    const newCount = Math.max(0, (community?.membersCount ?? 1) - 1);
    await tx.community.update({
      where: { id: communityId },
      data: { membersCount: newCount },
    });
  });
};

export const updateCommunity = async (id: string, data: Partial<CreateCommunityInput>) => {
  await getCommunityById(id);
  return db.community.update({ where: { id }, data });
};

export const deleteCommunity = async (id: string) => {
  await getCommunityById(id);
  return db.community.delete({ where: { id } });
};

export const approveCommunity = async (id: string) => {
  const community = await db.community.findUnique({ where: { id } });
  if (!community) throw new AppError('Community not found', 404);
  return db.community.update({
    where: { id },
    data: { status: 'APPROVED' }
  });
};

export const rejectCommunity = async (id: string) => {
  const community = await db.community.findUnique({ where: { id } });
  if (!community) throw new AppError('Community not found', 404);
  return db.community.update({
    where: { id },
    data: { status: 'REJECTED' }
  });
};

export const getAdminAllCommunities = async () => {
  return db.community.findMany({
    include: {
      _count: {
        select: { posts: true, members: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// --- Posts ---
export const createPost = async (userId: string, data: CreateCommunityPostInput) => {
  const post = await db.communityPost.create({
    data: {
      title: data.title,
      content: data.content ?? '', // Ensure non-null for DB constraint
      communityId: data.communityId,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType ? (data.mediaType.toUpperCase() as any) : null,
      pollData: data.pollData,
      authorId: userId,
      // No approval — posts are visible immediately to everyone
    },
    include: {
      author: { select: { id: true, name: true, avatar: true } }
    }
  });

  // Keep postsCount in sync
  await db.community.update({
    where: { id: data.communityId },
    data: { postsCount: { increment: 1 } },
  });

  return post;
};

export const getPostsByCommunity = async (communityId: string) => {
  // No status filter — all posts are visible to everyone immediately
  return db.communityPost.findMany({
    where: { communityId },
    include: { author: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: 'desc' }
  });
};

export const likePost = async (postId: string, voteType: 'UP' | 'DOWN' | 'NONE', previousVote: 'UP' | 'DOWN' | 'NONE') => {
  const prevVal = previousVote === 'UP' ? 1 : previousVote === 'DOWN' ? -1 : 0;
  const newVal = voteType === 'UP' ? 1 : voteType === 'DOWN' ? -1 : 0;
  const diff = newVal - prevVal;

  if (diff === 0) {
    const post = await db.communityPost.findUnique({ where: { id: postId } });
    if (!post) throw new AppError('Post not found', 404);
    return post;
  }

  return db.communityPost.update({
    where: { id: postId },
    data: {
      likes: { increment: diff }
    }
  });
};

export const getUserJoinedCommunities = async (userId: string) => {
  const memberships = await db.communityMember.findMany({
    where: { userId },
    select: { communityId: true }
  });
  return memberships.map(m => m.communityId);
};

export const votePoll = async (postId: string, optionId: string, previousOptionId: string | null) => {
  const post = await db.communityPost.findUnique({ where: { id: postId } });
  if (!post) throw new AppError('Post not found', 404);
  if (!post.pollData) throw new AppError('Post has no poll', 400);

  const poll = post.pollData as { question: string; options: { id: string; text: string; votes: number }[] };

  const updated = {
    ...poll,
    options: poll.options.map((opt) => {
      let votes = opt.votes;
      // Remove previous vote if switching options
      if (previousOptionId && opt.id === previousOptionId) votes = Math.max(0, votes - 1);
      // Add new vote
      if (opt.id === optionId) votes = votes + 1;
      return { ...opt, votes };
    }),
  };

  return db.communityPost.update({
    where: { id: postId },
    data: { pollData: updated },
  });
};

export const incrementPostViews = async (postId: string, userId?: string) => {
  const post = await db.communityPost.findUnique({ where: { id: postId } });
  if (!post) throw new Error('Post not found');

  if (!userId || userId === 'guest' || userId === 'anonymous') {
    return post;
  }

  const hasViewed = post.viewedBy?.includes(userId);
  if (hasViewed) {
    return post;
  }

  const newViewedBy = [...(post.viewedBy || []), userId];

  return db.communityPost.update({
    where: { id: postId },
    data: {
      viewedBy: newViewedBy,
      views: newViewedBy.length,
    },
  });
};

// --- Comments (persisted) ---
export const getPostComments = async (postId: string) => {
  return db.postComment.findMany({
    where: { postId, parentId: null },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
      children: {
        include: { author: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
};

export const createPostComment = async (postId: string, authorId: string, content: string, parentId?: string) => {
  const comment = await db.postComment.create({
    data: { postId, authorId, content, parentId: parentId || null },
    include: { author: { select: { id: true, name: true, avatar: true } } },
  });
  // Keep replies count in sync on parent post
  await db.communityPost.update({
    where: { id: postId },
    data: { replies: { increment: 1 } },
  });
  return comment;
};


