import { Interval } from '@/common/types/types';

export type PlanType = 'openSource' | 'creator' | 'pro';


export type PlanLimitsKeys =
  | 'maxSavedSearches'
  | 'maxAccounts'
  | 'maxScheduledCasts'
  | 'analyticsEnabledInterval'  
  | 'maxLongCastsPerDay'
  | 'maxLongCastsPerMonth'
  | 'longCastAnalyticsEnabled'
  | 'longCastPreviewCustomization'
  | 'longCastAdvancedFeatures';

export type PlanLimitsType = {  
  maxSavedSearches: number;
  maxAccounts: number;
  maxScheduledCasts: number;
  analyticsEnabledInterval: Interval[];  
  maxLongCastsPerDay: number;
  maxLongCastsPerMonth: number;
  longCastAnalyticsEnabled: boolean;
  longCastPreviewCustomization: boolean;
  longCastAdvancedFeatures: boolean;
};

const planLimits: Record<PlanType, PlanLimitsType> = {
  openSource: {    
    maxSavedSearches: 1,
    maxAccounts: 2,
    maxScheduledCasts: 3,
    analyticsEnabledInterval: [Interval.d7],
    maxLongCastsPerDay: 5,
    maxLongCastsPerMonth: 50,
    longCastAnalyticsEnabled: false,
    longCastPreviewCustomization: false,
    longCastAdvancedFeatures: false,
  },
  creator: {    
    maxSavedSearches: 5,
    maxAccounts: 10,
    maxScheduledCasts: 15,
    analyticsEnabledInterval: [Interval.d7, Interval.d30],
    maxLongCastsPerDay: 25,
    maxLongCastsPerMonth: 300,
    longCastAnalyticsEnabled: true,
    longCastPreviewCustomization: true,
    longCastAdvancedFeatures: false,
  },
  pro: {    
    maxSavedSearches: 10,
    maxAccounts: 20,
    maxScheduledCasts: 30,
    analyticsEnabledInterval: [Interval.d7, Interval.d30, Interval.d90],
    maxLongCastsPerDay: -1, 
    maxLongCastsPerMonth: -1, 
    longCastAnalyticsEnabled: true,
    longCastPreviewCustomization: true,
    longCastAdvancedFeatures: true,
  },
};

export const getPlanLimitsForPlan = (plan: PlanType): PlanLimitsType => {
  return planLimits[plan];
};


export const canCreateLongCast = (
  plan: PlanType,
  dailyLongCastCount: number,
  monthlyLongCastCount: number
): boolean => {
  const limits = getPlanLimitsForPlan(plan);

  const dailyLimitOk = limits.maxLongCastsPerDay === -1 || dailyLongCastCount < limits.maxLongCastsPerDay;
  const monthlyLimitOk = limits.maxLongCastsPerMonth === -1 || monthlyLongCastCount < limits.maxLongCastsPerMonth;

  return dailyLimitOk && monthlyLimitOk;
};

export const getLongCastLimitMessage = (
  plan: PlanType,
  dailyCount: number,
  monthlyCount: number
): string | null => {
  const limits = getPlanLimitsForPlan(plan);

  if (limits.maxLongCastsPerDay !== -1 && dailyCount >= limits.maxLongCastsPerDay) {
    return `You've reached your daily limit of ${limits.maxLongCastsPerDay} long casts. Upgrade for more!`;
  }

  if (limits.maxLongCastsPerMonth !== -1 && monthlyCount >= limits.maxLongCastsPerMonth) {
    return `You've reached your monthly limit of ${limits.maxLongCastsPerMonth} long casts. Upgrade for unlimited access!`;
  }

  return null;
};

export const getRemainingLongCasts = (
  plan: PlanType,
  dailyCount: number,
  monthlyCount: number
): {
  dailyRemaining: number | 'unlimited';
  monthlyRemaining: number | 'unlimited';
} => {
  const limits = getPlanLimitsForPlan(plan);

  return {
    dailyRemaining: limits.maxLongCastsPerDay === -1
      ? 'unlimited'
      : Math.max(0, limits.maxLongCastsPerDay - dailyCount),
    monthlyRemaining: limits.maxLongCastsPerMonth === -1
      ? 'unlimited'
      : Math.max(0, limits.maxLongCastsPerMonth - monthlyCount)
  };
};


export const LONG_CAST_LIMITS = {
  FREE_DAILY: planLimits.openSource.maxLongCastsPerDay,
  FREE_MONTHLY: planLimits.openSource.maxLongCastsPerMonth,
  CREATOR_DAILY: planLimits.creator.maxLongCastsPerDay,
  CREATOR_MONTHLY: planLimits.creator.maxLongCastsPerMonth,
} as const;


export interface LongCastUsage {
  dailyCount: number;
  monthlyCount: number;
  lastResetDate: string;
}


export const useLongCastLimits = (
  plan: PlanType,
  usage: LongCastUsage
) => {
  const limits = getPlanLimitsForPlan(plan);
  const canCreate = canCreateLongCast(plan, usage.dailyCount, usage.monthlyCount);
  const limitMessage = getLongCastLimitMessage(plan, usage.dailyCount, usage.monthlyCount);
  const remaining = getRemainingLongCasts(plan, usage.dailyCount, usage.monthlyCount);

  return {
    limits,
    canCreate,
    limitMessage,
    remaining,
    isUnlimited: limits.maxLongCastsPerDay === -1,
    hasAdvancedFeatures: limits.longCastAdvancedFeatures,
    hasAnalytics: limits.longCastAnalyticsEnabled,
    canCustomizePreview: limits.longCastPreviewCustomization,
  };
};
