export type Decision = 'ACT_NOW' | 'WATCH' | 'IGNORE';
export type FitLevel = 'STRONG_FIT' | 'WEAK_FIT' | 'NO_FIT';
export type StageId = 'STAGE_1_FILTER' | 'STAGE_2_CONTEXT' | 'STAGE_3_FIT' | 'STAGE_4_REPLY';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  createdAt: string;
}

export interface ProductProfile {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  targetAudience: string[];
  painPointsSolved: string[];
  keyFeatures: string[];
  toneOfVoice: 'empathic_expert' | 'friendly_peer' | 'consultative' | 'direct_builder';
  toneDescription?: string;
  exclusionRules: string[];
  exampleHook?: string;
  pricePoint?: string;
}

export interface CommunityMessage {
  id: string;
  author: string;
  platform: 'Reddit' | 'Twitter/X' | 'Telegram' | 'Discord' | 'LinkedIn' | 'Forum';
  sourceCommunity: string;
  timestamp: string;
  text: string;
  threadContext?: string;
  likesOrUpvotes?: number;
  repliesCount?: number;
}

export interface Stage1Result {
  passed: boolean;
  relevanceScore: number; // 0 - 100
  discardReason?: string;
  matchedKeywords: string[];
  tokensUsed: number;
  costUsd: number;
  processingTimeMs: number;
}

export interface Stage2Result {
  detectedProblem: string;
  intentType: 'SEEKING_RECOMMENDATION' | 'EXPRESSING_FRUSTRATION' | 'ASKING_ADVICE' | 'CASUAL_CHATTER' | 'OFFERING_HELP';
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  userSkillOrStatus: string;
  detectedConstraints: string[];
  tokensUsed: number;
  costUsd: number;
  processingTimeMs: number;
}

export interface Stage3Result {
  fitLevel: FitLevel;
  opportunityScore: number; // 0 - 100
  decision: Decision;
  fitReasoning: string;
  matchedPainPoints: string[];
  risksOrDisqualifiers: string[];
  tokensUsed: number;
  costUsd: number;
  processingTimeMs: number;
}

export interface Stage4Result {
  suggestedReply: string;
  replyStrategy: string;
  callToAction: string;
  tokensUsed: number;
  costUsd: number;
  processingTimeMs: number;
}

export interface MessageAnalysis {
  messageId: string;
  message: CommunityMessage;
  profileId: string;
  analyzedAt: string;
  currentStage: StageId;
  status: 'COMPLETED' | 'FILTERED_OUT' | 'ERROR';
  decision: Decision;
  totalOpportunityScore: number; // 0 - 100
  totalTokensUsed: number;
  totalCostUsd: number;
  costSavedUsd: number; // How much was saved if filtered early vs full run
  replyUsed?: boolean;
  notes?: string;

  stage1?: Stage1Result;
  stage2?: Stage2Result;
  stage3?: Stage3Result;
  stage4?: Stage4Result;
}

export interface RunSummary {
  runId: string;
  startedAt: string;
  completedAt: string;
  totalMessages: number;
  stage1FilteredOut: number;
  stage2FilteredOut: number;
  stage3WeakWatch: number;
  stage4ActNow: number;
  totalTokens: number;
  totalCostUsd: number;
  estimatedCostWithoutFilter: number;
  savingsPercentage: number;
  averageScore: number;
}
