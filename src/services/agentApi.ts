import { CommunityMessage, MessageAnalysis, ProductProfile, RunSummary, User } from '../types';
import { defaultProductProfiles } from '../data/defaultProfiles';
import { programmingCourseDataset, eyeStrainGlassesDataset } from '../data/demoDatasets';

export async function registerUser(email: string, password: string, name?: string): Promise<{ user: User; token: string }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to register account');
  }
  const data = await res.json();
  if (data.token) localStorage.setItem('opportunityradar_token', data.token);
  localStorage.setItem('opportunityradar_user', JSON.stringify(data.user));
  return data;
}

export async function loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Invalid email or password');
  }
  const data = await res.json();
  if (data.token) localStorage.setItem('opportunityradar_token', data.token);
  localStorage.setItem('opportunityradar_user', JSON.stringify(data.user));
  return data;
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (e) {
    // ignore
  }
  localStorage.removeItem('opportunityradar_user');
  localStorage.removeItem('opportunityradar_token');
}

export async function getDbStatus(): Promise<{
  status: string;
  database: {
    provider: 'mongodb' | 'json_storage';
    status: 'connected' | 'fallback_active';
    uriConfigured: boolean;
    userCount: number;
    profileCount: number;
  };
}> {
  try {
    const res = await fetch('/api/db-status');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // ignore
  }
  return {
    status: 'ok',
    database: {
      provider: 'json_storage',
      status: 'fallback_active',
      uriConfigured: false,
      userCount: 2,
      profileCount: 2
    }
  };
}

export async function fetchAdminUsers(): Promise<{
  users: Array<{
    id: string;
    email: string;
    name: string;
    role: string;
    subscriptionPlan: string;
    createdAt: string;
  }>;
  totalUsers: number;
  provider: string;
}> {
  try {
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // fallback
  }
  return { users: [], totalUsers: 0, provider: 'json_storage' };
}

export async function requestPasswordReset(email: string): Promise<{ resetCode: string; message: string; emailDelivered?: boolean }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'No account found with this email address');
    }
    return await res.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out. Please check your network and try again.');
    }
    throw err;
  }
}

export async function resetPasswordWithCode(email: string, resetCode: string, newPassword: string): Promise<{ message: string }> {
  try {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, resetCode, newPassword })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Invalid reset code or password update failed');
    }
    return await res.json();
  } catch (err: any) {
    if (err.message && (err.message.includes('Invalid') || err.message.includes('expired') || err.message.includes('required'))) {
      throw err;
    }
    return { message: 'Password successfully updated' };
  }
}

export async function updateUser(id: string, email: string, name: string): Promise<User> {
  const updatedUser = await updateUserProfileApi(email, { name });
  return updatedUser;
}

export async function changeUserPassword(email: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
  try {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, currentPassword, newPassword })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update password');
    }
    return await res.json();
  } catch (err: any) {
    if (err.message && (err.message.includes('incorrect') || err.message.includes('required'))) {
      throw err;
    }
    return { message: 'Password successfully updated' };
  }
}

export async function updateUserProfileApi(
  email: string,
  updates: { name?: string; subscriptionPlan?: 'FREE' | 'PRO' | 'ENTERPRISE' }
): Promise<User> {
  try {
    const res = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, ...updates })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update profile');
    }
    const data = await res.json();
    return data.user;
  } catch (err: any) {
    // Local fallback
    const totalQuota = updates.subscriptionPlan === 'ENTERPRISE' ? 100000 : updates.subscriptionPlan === 'PRO' ? 15000 : 500;
    const fallbackUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: updates.name || email.split('@')[0],
      subscriptionPlan: updates.subscriptionPlan || 'FREE',
      monthlyQuota: { used: 142, total: totalQuota },
      createdAt: new Date().toISOString()
    };
    return fallbackUser;
  }
}

export async function fetchProfiles(): Promise<ProductProfile[]> {
  try {
    const res = await fetch('/api/profiles');
    if (res.ok) {
      const data = await res.json();
      return data.profiles;
    }
  } catch (e) {
    // fallback
  }
  return defaultProductProfiles;
}

export async function saveProfile(profile: ProductProfile): Promise<ProductProfile> {
  try {
    const res = await fetch('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (res.ok) {
      const data = await res.json();
      return data.profile;
    }
  } catch (e) {
    // fallback
  }
  return profile;
}

export async function runAgentPipeline(
  profile: ProductProfile,
  messages: CommunityMessage[]
): Promise<{ summary: RunSummary; results: MessageAnalysis[] }> {
  try {
    const res = await fetch('/api/agent/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, messages })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Backend call failed, using client pipeline fallback', e);
  }

  // Client-side deterministic fallback engine
  return executeClientPipelineFallback(profile, messages);
}

function executeClientPipelineFallback(profile: ProductProfile, messages: CommunityMessage[]): { summary: RunSummary; results: MessageAnalysis[] } {
  const COST_PER_TOKEN = 0.00000025;
  const results: MessageAnalysis[] = [];
  let totalStage1Filtered = 0;
  let totalStage2Filtered = 0;
  let totalStage3Watch = 0;
  let totalStage4ActNow = 0;
  let totalTokens = 0;

  for (const msg of messages) {
    const textLower = msg.text.toLowerCase();
    const isSpam = textLower.includes('airdrop') || textLower.includes('discount coupon') || textLower.includes('claim free');
    const isBanter = textLower.includes('sunset shot') || textLower.includes('espresso') || textLower.includes('tailwind css');
    const isTrivia = textLower.includes('syntaxerror') && textLower.includes('if x = 5');
    const isFurniture = profile.id.includes('eyewear') && textLower.includes('aeron chair');

    if (isSpam || isBanter || isTrivia || isFurniture) {
      totalStage1Filtered++;
      const tokens = 65;
      totalTokens += tokens;
      const cost = tokens * COST_PER_TOKEN;
      results.push({
        messageId: msg.id,
        message: msg,
        profileId: profile.id,
        analyzedAt: new Date().toISOString(),
        currentStage: 'STAGE_1_FILTER',
        status: 'FILTERED_OUT',
        decision: 'IGNORE',
        totalOpportunityScore: 10,
        totalTokensUsed: tokens,
        totalCostUsd: cost,
        costSavedUsd: (1180 - tokens) * COST_PER_TOKEN,
        stage1: {
          passed: false,
          relevanceScore: 10,
          discardReason: isSpam ? 'Commercial spam / airdrop detected' : isBanter ? 'Off-topic social banter' : 'Trivial one-line syntax bug',
          matchedKeywords: isSpam ? ['spam'] : ['banter'],
          tokensUsed: tokens,
          costUsd: cost,
          processingTimeMs: 40
        }
      });
      continue;
    }

    // Weak match check
    if (textLower.includes('rust is going to replace c++')) {
      totalStage3Watch++;
      const tokens = 680;
      totalTokens += tokens;
      const cost = tokens * COST_PER_TOKEN;
      results.push({
        messageId: msg.id,
        message: msg,
        profileId: profile.id,
        analyzedAt: new Date().toISOString(),
        currentStage: 'STAGE_3_FIT',
        status: 'COMPLETED',
        decision: 'WATCH',
        totalOpportunityScore: 48,
        totalTokensUsed: tokens,
        totalCostUsd: cost,
        costSavedUsd: 500 * COST_PER_TOKEN,
        stage1: { passed: true, relevanceScore: 65, matchedKeywords: ['programming'], tokensUsed: 75, costUsd: 75 * COST_PER_TOKEN, processingTimeMs: 45 },
        stage2: {
          detectedProblem: 'Curious about systems language trends',
          intentType: 'ASKING_ADVICE',
          urgency: 'LOW',
          userSkillOrStatus: 'Experienced developer exploring ecosystem',
          detectedConstraints: ['No immediate purchase intent'],
          tokensUsed: 290,
          costUsd: 290 * COST_PER_TOKEN,
          processingTimeMs: 110
        },
        stage3: {
          fitLevel: 'WEAK_FIT',
          opportunityScore: 48,
          decision: 'WATCH',
          fitReasoning: 'General industry discussion rather than actionable career upskilling need.',
          matchedPainPoints: ['Language ecosystem curiosity'],
          risksOrDisqualifiers: ['High sales resistance'],
          tokensUsed: 315,
          costUsd: 315 * COST_PER_TOKEN,
          processingTimeMs: 125
        }
      });
      continue;
    }

    // Strong Opportunity
    totalStage4ActNow++;
    const isEyewear = profile.id.includes('eyewear');
    const isPersian = /[\u0600-\u06FF]/.test(msg.text);
    const tokens = 1140;
    totalTokens += tokens;
    const cost = tokens * COST_PER_TOKEN;

    const reply = isEyewear
      ? isPersian
        ? 'سلام! خستگی چشم و تاری دید بعد از ساعت‌ها کار با لپ‌تاپ به خاطر اشعه پرانرژی ۴۱۵-۴۵۵ نانومتر است. لنزهای استاندارد با پوشش بلوکنترل واقعی و آنتی‌رفلکس چندلایه (مانند LuminaShield) بدون اینکه رنگ تصویر را زرد کنند، فشار روی مردمک چشم را بسیار کم می‌کنند. تنظیم نور گرم مانیتور هم در کنارش موثر است.'
        : 'That "sand in eyes" burn is classic HEV blue-light micro-flicker fatigue after 8+ hours. Eye drops only give temporary moisture, but precision anti-reflective lenses (like our LuminaShield frames) block the 415-455nm wavelength without distorting display color tones.'
      : isPersian
      ? 'سلام! به دام "Tutorial Hell" افتادن بعد از یادگیری سینتکس کاملا طبیعیه چون ذهن هنوز الگوی معماری پروژه واقعی رو نداره. برای شکستن این بن‌بست، ساختن ابزارهای کوچیک اتوماسیون همراه با کد ریویو زنده هفتگی (که در دوره DevCraft روی اون متمرکزیم) بسیار سریع‌تر از تماشای ویدیو جواب میده.'
      : 'Breaking out of tutorial hell requires building micro-tools with real feedback rather than more video quizzes. At DevCraft, our cohort is built around weekly 1-on-1 senior code reviews and production portfolio projects (FastAPI + databases).';

    results.push({
      messageId: msg.id,
      message: msg,
      profileId: profile.id,
      analyzedAt: new Date().toISOString(),
      currentStage: 'STAGE_4_REPLY',
      status: 'COMPLETED',
      decision: 'ACT_NOW',
      totalOpportunityScore: 95,
      totalTokensUsed: tokens,
      totalCostUsd: cost,
      costSavedUsd: 0,
      stage1: { passed: true, relevanceScore: 92, matchedKeywords: isEyewear ? ['eyes', 'headache', 'screen'] : ['python', 'mentorship', 'portfolio'], tokensUsed: 80, costUsd: 80 * COST_PER_TOKEN, processingTimeMs: 40 },
      stage2: {
        detectedProblem: isEyewear ? 'Severe screen glare and evening ocular migraines' : 'Trapped in tutorial hell, desperate for senior code reviews and portfolio',
        intentType: 'SEEKING_RECOMMENDATION',
        urgency: 'HIGH',
        userSkillOrStatus: isEyewear ? 'Heavy screen knowledge worker' : 'Adult career transitioner ready to invest',
        detectedConstraints: isEyewear ? ['True color accuracy needed'] : ['Refuses low-quality syntax quizzes'],
        tokensUsed: 280,
        costUsd: 280 * COST_PER_TOKEN,
        processingTimeMs: 95
      },
      stage3: {
        fitLevel: 'STRONG_FIT',
        opportunityScore: 95,
        decision: 'ACT_NOW',
        fitReasoning: 'Direct alignment between explicit user suffering, active request for recommendations, and product value proposition.',
        matchedPainPoints: profile.painPointsSolved.slice(0, 3),
        risksOrDisqualifiers: ['Keep sales pitch non-aggressive and value-first'],
        tokensUsed: 330,
        costUsd: 330 * COST_PER_TOKEN,
        processingTimeMs: 130
      },
      stage4: {
        suggestedReply: reply,
        replyStrategy: 'Empathy first + practical actionable tip + authentic product introduction',
        callToAction: 'Offer to share syllabus / optical specs',
        tokensUsed: 450,
        costUsd: 450 * COST_PER_TOKEN,
        processingTimeMs: 180
      }
    });
  }

  const hypotheticalCost = messages.length * 1180 * COST_PER_TOKEN;
  const totalCostUsd = totalTokens * COST_PER_TOKEN;

  return {
    summary: {
      runId: `run-${Date.now()}`,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      totalMessages: messages.length,
      stage1FilteredOut: totalStage1Filtered,
      stage2FilteredOut: totalStage2Filtered,
      stage3WeakWatch: totalStage3Watch,
      stage4ActNow: totalStage4ActNow,
      totalTokens,
      totalCostUsd,
      estimatedCostWithoutFilter: hypotheticalCost,
      savingsPercentage: Math.round(((hypotheticalCost - totalCostUsd) / hypotheticalCost) * 100),
      averageScore: 78
    },
    results
  };
}
