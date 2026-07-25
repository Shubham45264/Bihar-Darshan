// ── Community Data (Deprecated/Removed) ──────────────────────────────────────

export interface Community {
  id: string;
  slug?: string;
  name: string;
  subtitle?: string;
  shortDescription?: string;
  description: string;
  bannerImageUrl?: string;
  logoImageUrl?: string;
  image?: string;
  icon?: string;
  iconBg?: string;
  members: string | number;
  posts: string | number;
  online?: number;
  category: string | null;
  verified?: boolean;
  createdOn?: string;
  aboutText?: string;
  rules?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  membersCount?: number;
  postsCount?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdBy?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
}

export interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  timeAgo: string;
  content: string;
  replies?: Comment[];
}

export interface Discussion {
  id: string;
  communityId: string;
  title: string;
  content?: string;
  author: string;
  authorAvatar: string;
  timeAgo: string;
  views: string;
  replies: number;
  likes?: number;
  tag: 'Destinations' | 'Tips' | 'Events' | 'Itinerary';
  tagColor: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  poll?: Poll;
  comments?: Comment[];
}

export interface Contributor {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  color: string;
}

export const communities: Community[] = [];
export const discussions: Discussion[] = [];
export const contributors: Contributor[] = [];
export const communityGuidelines: string[] = [];
export const memberAvatars: { initials: string; color: string }[] = [];
