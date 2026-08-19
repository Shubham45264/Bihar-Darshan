export interface BadgeInfo {
  name: string;
  icon: string;
  fullName: string;
  meaning: string;
  minPoints: number;
  maxPoints: number | null;
  nextBadgeName: string | null;
  nextMilestone: number | null;
  pointsNeeded: number;
  progressPercent: number;
}

export const BADGE_TIERS: Omit<BadgeInfo, 'pointsNeeded' | 'progressPercent'>[] = [
  {
    name: 'Vedic Scholar',
    icon: '📜',
    fullName: '📜 Vedic Scholar',
    meaning: "A new contributor exploring and contributing to Bihar's culture and heritage.",
    minPoints: 0,
    maxPoints: 99,
    nextBadgeName: 'Culture Champion',
    nextMilestone: 100,
  },
  {
    name: 'Culture Champion',
    icon: '🪷',
    fullName: '🪷 Culture Champion',
    meaning: "An active contributor helping promote Bihar's culture, traditions and destinations.",
    minPoints: 100,
    maxPoints: 249,
    nextBadgeName: 'Heritage Guardian',
    nextMilestone: 250,
  },
  {
    name: 'Heritage Guardian',
    icon: '🏛️',
    fullName: '🏛️ Heritage Guardian',
    meaning: "A strong contributor actively helping preserve and share Bihar's heritage.",
    minPoints: 250,
    maxPoints: 499,
    nextBadgeName: 'Heritage Sovereign',
    nextMilestone: 500,
  },
  {
    name: 'Heritage Sovereign',
    icon: '👑',
    fullName: '👑 Heritage Sovereign',
    meaning: "An elite contributor making significant contributions to the Bihar Darshan community.",
    minPoints: 500,
    maxPoints: 999,
    nextBadgeName: 'Bihar Legend',
    nextMilestone: 1000,
  },
  {
    name: 'Bihar Legend',
    icon: '🌟',
    fullName: '🌟 Bihar Legend',
    meaning: 'The highest achievement for exceptional contribution to Bihar Darshan.',
    minPoints: 1000,
    maxPoints: null,
    nextBadgeName: null,
    nextMilestone: null,
  },
];

export const getBadgeFromPoints = (points: number = 0): BadgeInfo => {
  const currentPoints = Math.max(0, points);

  let currentTier = BADGE_TIERS[0];
  for (let i = BADGE_TIERS.length - 1; i >= 0; i--) {
    if (currentPoints >= BADGE_TIERS[i].minPoints) {
      currentTier = BADGE_TIERS[i];
      break;
    }
  }

  let pointsNeeded = 0;
  let progressPercent = 100;

  if (currentTier.nextMilestone !== null) {
    const rangeSpan = currentTier.nextMilestone - currentTier.minPoints;
    const pointsAccruedInTier = currentPoints - currentTier.minPoints;
    pointsNeeded = currentTier.nextMilestone - currentPoints;
    progressPercent = Math.min(100, Math.max(0, Math.floor((pointsAccruedInTier / rangeSpan) * 100)));
  }

  return {
    ...currentTier,
    pointsNeeded,
    progressPercent,
  };
};
