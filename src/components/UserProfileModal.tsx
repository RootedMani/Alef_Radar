import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  CreditCard,
  Key,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  Zap,
  Clock,
  ArrowRight,
  LogOut,
  Moon,
  Sun,
  Globe,
  Users,
  Download,
  Search,
  Database
} from 'lucide-react';
import { User } from '../types';
import { updateUserProfileApi, getDbStatus, fetchAdminUsers } from '../services/agentApi';
import { Language, translations } from '../utils/i18n';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSetDarkMode?: (isDark: boolean) => void;
  language: Language;
  onSetLanguage: (lang: Language) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
  darkMode,
  onToggleDarkMode,
  onSetDarkMode,
  language,
  onSetLanguage,
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'subscription' | 'api' | 'preferences' | 'users'>('account');
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<{
    provider: 'mongodb' | 'json_storage';
    status: 'connected' | 'fallback_active';
    uriConfigured: boolean;
    userCount: number;
    profileCount: number;
  } | null>(null);
  const [adminUsers, setAdminUsers] = useState<Array<{ id: string; email: string; name: string; role: string; subscriptionPlan: string; createdAt: string }>>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      getDbStatus().then((res) => {
        if (res && res.database) setDbStatus(res.database);
      }).catch(() => {});
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && activeTab === 'users') {
      setUsersLoading(true);
      fetchAdminUsers().then((res) => {
        setAdminUsers(res.users || []);
      }).finally(() => setUsersLoading(false));
    }
  }, [isOpen, activeTab]);

  const handleExportUsersJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(adminUsers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `alef_radar_users_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportUsersCsv = () => {
    if (!adminUsers.length) return;
    const headers = ['ID', 'Email', 'Name', 'Role', 'SubscriptionPlan', 'CreatedAt'];
    const rows = adminUsers.map((u) => [u.id, u.email, `"${u.name}"`, u.role || 'Member', u.subscriptionPlan || 'FREE', u.createdAt]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `alef_radar_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isOpen || !user) return null;

  const t = translations[language];
  const isRtl = language === 'fa';

  const plan = user.subscriptionPlan || 'FREE';
  const quotaUsed = user.monthlyQuota?.used || 142;
  const quotaTotal = plan === 'ENTERPRISE' ? 100000 : plan === 'PRO' ? 15000 : 500;
  const quotaPercentage = Math.min(100, Math.round((quotaUsed / quotaTotal) * 100));
  const fallbackKey = (() => {
    try {
      return btoa(unescape(encodeURIComponent(user.email || 'user'))).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    } catch {
      return 'user1234567890';
    }
  })();
  const apiKey = user.apiKey || `or_live_${fallbackKey}`;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updated = await updateUserProfileApi(user.email, { name: displayName.trim() });
      onUpdateUser({ ...user, name: updated.name });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      // Local fallback
      onUpdateUser({ ...user, name: displayName.trim() });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePlanChange = async (newPlan: 'FREE' | 'PRO' | 'ENTERPRISE') => {
    setIsSaving(true);
    setUpgradeMessage(null);

    try {
      const updated = await updateUserProfileApi(user.email, { subscriptionPlan: newPlan });
      const newTotal = newPlan === 'ENTERPRISE' ? 100000 : newPlan === 'PRO' ? 15000 : 500;
      onUpdateUser({
        ...user,
        subscriptionPlan: newPlan,
        monthlyQuota: { used: quotaUsed, total: newTotal }
      });
      setUpgradeMessage(
        newPlan === 'PRO'
          ? (language === 'fa' ? 'طرح شما با موفقیت به طرح رشد (Pro Growth) ارتقا یافت!' : 'Successfully upgraded to Pro Growth Plan!')
          : (language === 'fa' ? 'طرح شما به نسخه رایگان تغییر کرد.' : 'Switched to Free Starter Plan.')
      );
      setTimeout(() => setUpgradeMessage(null), 3500);
    } catch {
      const newTotal = newPlan === 'ENTERPRISE' ? 100000 : newPlan === 'PRO' ? 15000 : 500;
      onUpdateUser({
        ...user,
        subscriptionPlan: newPlan,
        monthlyQuota: { used: quotaUsed, total: newTotal }
      });
      setUpgradeMessage(language === 'fa' ? 'طرح به‌روزرسانی شد!' : 'Subscription updated!');
      setTimeout(() => setUpgradeMessage(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="relative w-full max-w-xl rounded-3xl glass-modal shadow-2xl p-6 sm:p-8 overflow-hidden transition-colors">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 ${isRtl ? 'left-5' : 'right-5'} p-1.5 rounded-lg transition-colors cursor-pointer ${
            darkMode ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900' : 'text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Profile Header */}
        <div className="flex items-center space-x-3.5 rtl:space-x-reverse mb-6 pb-5 border-b border-neutral-200/80 dark:border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-lg font-black shadow-sm shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <h2 className="text-lg font-black tracking-tight truncate">{user.name || 'User Profile'}</h2>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                plan === 'PRO'
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-700 dark:text-zinc-300 border border-neutral-200 dark:border-zinc-700'
              }`}>
                {plan === 'PRO' ? (language === 'fa' ? 'طرح حرفه‌ای' : 'PRO GROWTH') : (language === 'fa' ? 'رایگان' : 'FREE PLAN')}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-zinc-400 truncate mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-100/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-xl mb-6 border border-neutral-200/80 dark:border-white/10">
          <button
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'account'
                ? 'bg-white dark:bg-zinc-800 text-neutral-950 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {t.accountTab}
          </button>

          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'subscription'
                ? 'bg-white dark:bg-zinc-800 text-neutral-950 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {t.subscriptionTab}
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'api'
                ? 'bg-white dark:bg-zinc-800 text-neutral-950 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {t.apiTab}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 rtl:space-x-reverse ${
              activeTab === 'users'
                ? 'bg-white dark:bg-zinc-800 text-neutral-950 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{language === 'fa' ? 'داده‌های کاربران' : 'Users Data'}</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'preferences'
                ? 'bg-white dark:bg-zinc-800 text-neutral-950 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {language === 'fa' ? 'تنظیمات' : 'Preferences'}
          </button>
        </div>

        {/* Upgrade / Success Feedback Message */}
        {upgradeMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2 rtl:space-x-reverse">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{upgradeMessage}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-neutral-100 dark:bg-zinc-900 border border-neutral-300 dark:border-zinc-700 text-neutral-900 dark:text-zinc-100 text-xs font-bold flex items-center space-x-2 rtl:space-x-reverse">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{t.savedSuccess}</span>
          </div>
        )}

        {/* TAB 1: ACCOUNT DETAILS */}
        {activeTab === 'account' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-zinc-300 mb-1.5">
                {t.displayNameLabel}
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full rounded-xl py-2 px-3 text-xs focus:outline-none transition-colors glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-zinc-300 mb-1.5">
                {t.emailLabel}
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full rounded-xl py-2 px-3 text-xs opacity-70 cursor-not-allowed glass-input font-mono"
              />
              <span className="text-[10px] text-neutral-400 mt-1 block">
                {language === 'fa' ? 'آدرس ایمیل شناسه اصلی حساب شماست.' : 'Email is verified and serves as your account unique identifier.'}
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2.5 px-4 bg-black dark:bg-white text-white dark:text-black font-extrabold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSaving ? (language === 'fa' ? 'در حال ذخیره...' : 'Saving...') : t.saveChangesBtn}
              </button>
            </div>

            {/* Database & Storage Engine Status */}
            {dbStatus && (
              <div className="mt-4 p-3 rounded-2xl glass-card text-xs space-y-1.5 border border-neutral-200/70 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase font-bold text-neutral-500 dark:text-zinc-400">
                    {language === 'fa' ? 'پایگاه داده و ذخیره‌سازی' : 'Database & Storage Engine'}
                  </span>
                  <span className={`inline-flex items-center space-x-1.5 rtl:space-x-reverse px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    dbStatus.provider === 'mongodb'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span>
                      {dbStatus.provider === 'mongodb'
                        ? 'MongoDB (Atlas / Remote)'
                        : (language === 'fa' ? 'ذخیره‌سازی پایدار محلی' : 'Persistent Local Storage')}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-600 dark:text-zinc-400 pt-1">
                  <span>{language === 'fa' ? 'کاربران ثبت‌شده:' : 'Registered Users:'} <strong className="text-neutral-900 dark:text-zinc-200 font-mono">{dbStatus.userCount}</strong></span>
                  <span>{language === 'fa' ? 'پروفایل‌های محصول:' : 'Product Profiles:'} <strong className="text-neutral-900 dark:text-zinc-200 font-mono">{dbStatus.profileCount}</strong></span>
                </div>
              </div>
            )}
          </form>
        )}

        {/* TAB 2: SUBSCRIPTION & USAGE STATUS */}
        {activeTab === 'subscription' && (
          <div className="space-y-5">
            {/* Current Plan Overview Card */}
            <div className="p-4 rounded-2xl glass-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                  {t.currentPlanLabel}
                </span>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                  plan === 'PRO' ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-neutral-200 dark:bg-zinc-800 text-neutral-800 dark:text-zinc-200'
                }`}>
                  {plan === 'PRO' ? (language === 'fa' ? 'طرح رشد (۴۹ دلار/ماه)' : 'Pro Growth ($49/mo)') : (language === 'fa' ? 'طرح آغازین ($۰/ماه)' : 'Free Starter ($0/mo)')}
                </span>
              </div>

              {/* Monthly Quota Meter */}
              <div className="space-y-1.5 mt-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-500 dark:text-zinc-400">{t.postsScanned}</span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {quotaUsed.toLocaleString()} / {quotaTotal.toLocaleString()} ({quotaPercentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                    style={{ width: `${quotaPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
                  <span>{language === 'fa' ? 'دوره ماهانه' : 'Monthly Cycle'}</span>
                  <span>{language === 'fa' ? 'تمدید خودکار اول هر ماه' : 'Renews on 1st of each month'}</span>
                </div>
              </div>
            </div>

            {/* Plan Switcher / Upgrade Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
                plan === 'FREE'
                  ? 'glass-panel border-neutral-950 dark:border-white shadow-xs'
                  : 'glass-card'
              }`}>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider">{t.planFree}</h4>
                  <div className="text-lg font-black mt-1">$0 <span className="text-xs text-neutral-500 font-normal">/ {language === 'fa' ? 'ماه' : 'mo'}</span></div>
                  <ul className="text-[11px] text-neutral-500 dark:text-zinc-400 mt-2 space-y-1">
                    <li>• {language === 'fa' ? '۵۰۰ پیام / ماه' : '500 posts / month'}</li>
                    <li>• {language === 'fa' ? '۲ پروفایل محصول' : '2 Product Profiles'}</li>
                    <li>• {language === 'fa' ? 'اسکنر آبشاری ۴ مرحله‌ای' : '4-Stage cascade scanner'}</li>
                  </ul>
                </div>
                {plan === 'PRO' && (
                  <button
                    onClick={() => handlePlanChange('FREE')}
                    className="mt-3 w-full py-1.5 px-2 rounded-lg border border-neutral-300 dark:border-zinc-700 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-xs font-bold cursor-pointer transition-colors"
                  >
                    {t.downgradeToFree}
                  </button>
                )}
              </div>

              <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
                plan === 'PRO'
                  ? 'glass-panel border-neutral-950 dark:border-white ring-1 ring-neutral-950 dark:ring-white shadow-md'
                  : 'glass-card'
              }`}>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider">{t.planPro}</h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-black dark:bg-white text-white dark:text-black">
                      {language === 'fa' ? 'محبوب' : 'HOT'}
                    </span>
                  </div>
                  <div className="text-lg font-black mt-1">$49 <span className="text-xs text-neutral-500 font-normal">/ {language === 'fa' ? 'ماه' : 'mo'}</span></div>
                  <ul className="text-[11px] text-neutral-600 dark:text-zinc-300 mt-2 space-y-1">
                    <li>• {language === 'fa' ? '۱۵,۰۰۰ پیام / ماه' : '15,000 posts / month'}</li>
                    <li>• {language === 'fa' ? 'پروفایل‌های نامحدود' : 'Unlimited Profiles'}</li>
                    <li>• {language === 'fa' ? 'وب‌هوک و API زنده' : 'Live webhook ingest API'}</li>
                  </ul>
                </div>
                {plan === 'FREE' && (
                  <button
                    onClick={() => handlePlanChange('PRO')}
                    className="mt-3 w-full py-2 px-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-bold cursor-pointer transition-all hover:opacity-90 shadow-xs"
                  >
                    {t.upgradeToPro}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: API & DEVELOPER KEYS */}
        {activeTab === 'api' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-zinc-300 mb-1.5">
                {t.apiKeyLabel}
              </label>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  type="text"
                  readOnly
                  value={apiKey}
                  className="flex-1 rounded-xl py-2 px-3 text-xs font-mono glass-input"
                />
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-3 py-2 rounded-xl border border-neutral-200/80 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-xs font-bold flex items-center space-x-1 rtl:space-x-reverse cursor-pointer shadow-xs"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? (language === 'fa' ? 'کپی شد' : 'Copied') : t.copyApiKey}</span>
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                {language === 'fa'
                  ? 'از این کلید در هدر `Authorization: Bearer <KEY>` برای ارسال مستقیم پیام‌ها به وب‌سرویس رادار استفاده کنید.'
                  : 'Pass this key in the Authorization: Bearer <KEY> header to stream community webhooks into the 4-stage cascade.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-card font-mono text-xs">
              <span className="text-[10px] text-neutral-400 block mb-1">
                {language === 'fa' ? 'نمونه فراخوانی با CURL:' : 'CURL INGESTION EXAMPLE:'}
              </span>
              <pre className="text-[11px] overflow-x-auto whitespace-pre-wrap" dir="ltr">
{`curl -X POST /api/agent/run \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"messages": [{"text": "Need python mentor..."}]}'`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: USERS DATA EXPLORER (ADMIN / FOUNDER VIEW) */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Database Storage Location & Access Guidance */}
            <div className="p-3.5 rounded-2xl glass-card text-xs space-y-2 border border-neutral-200/80 dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-extrabold uppercase text-neutral-900 dark:text-zinc-100 flex items-center space-x-1.5 rtl:space-x-reverse">
                  <Database className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{language === 'fa' ? 'روش‌های دسترسی به داده‌های کاربران' : 'Where Your Users Data Lives'}</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                  dbStatus?.provider === 'mongodb'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                }`}>
                  {dbStatus?.provider === 'mongodb' ? 'MongoDB Atlas' : 'Local JSON File'}
                </span>
              </div>

              <p className="text-[11px] text-neutral-600 dark:text-zinc-300 leading-relaxed">
                {language === 'fa' ? (
                  <>
                    ۱. <strong>MongoDB Atlas:</strong> وارد پنل ابری یا نرم‌افزار <em>MongoDB Compass</em> شوید، دیتابیس <code>alef-radar</code> و کالکشن <code>users</code> را مشاهده کنید.<br />
                    ۲. <strong>فایل مستقیم:</strong> مسیر سرور <code>data/database.json</code> تمام داده‌های ذخیره‌شده را در بر دارد.<br />
                    ۳. <strong>API زنده:</strong> فراخوانی <code>GET /api/admin/users</code> خروجی کامل کاربران را تحویل می‌دهد.
                  </>
                ) : (
                  <>
                    1. <strong>MongoDB Atlas / Compass:</strong> Connect via your MongoDB URI to inspect collection <code>users</code> in database <code>alef-radar</code>.<br />
                    2. <strong>Direct Server File:</strong> Check <code>data/database.json</code> on disk for raw persistent records.<br />
                    3. <strong>Instant API:</strong> Query <code>GET /api/admin/users</code> to retrieve all registered accounts programmatically.
                  </>
                )}
              </p>
            </div>

            {/* Search and Export Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <div className="relative flex-1">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-neutral-400`}>
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  placeholder={language === 'fa' ? 'جستجوی کاربر بر اساس نام یا ایمیل...' : 'Search users by name or email...'}
                  className={`w-full glass-input rounded-xl py-1.5 ${isRtl ? 'pr-8 pl-3' : 'pl-8 pr-3'} text-xs text-neutral-900 dark:text-zinc-100 placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors`}
                />
              </div>

              <div className="flex items-center space-x-1.5 rtl:space-x-reverse self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={handleExportUsersJson}
                  disabled={!adminUsers.length}
                  className="inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1.5 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-800/70 hover:bg-white dark:hover:bg-zinc-700 text-neutral-900 dark:text-zinc-100 text-[11px] font-bold cursor-pointer transition-colors shadow-2xs disabled:opacity-50"
                >
                  <Download className="w-3 h-3" />
                  <span>JSON</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportUsersCsv}
                  disabled={!adminUsers.length}
                  className="inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1.5 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-800/70 hover:bg-white dark:hover:bg-zinc-700 text-neutral-900 dark:text-zinc-100 text-[11px] font-bold cursor-pointer transition-colors shadow-2xs disabled:opacity-50"
                >
                  <Download className="w-3 h-3" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* Users Data Table */}
            <div className="max-h-64 overflow-y-auto rounded-2xl border border-neutral-200/80 dark:border-white/10 glass-card">
              {usersLoading ? (
                <div className="p-8 text-center text-xs text-neutral-400">
                  {language === 'fa' ? 'در حال بارگذاری کاربران از پایگاه داده...' : 'Loading registered users from database...'}
                </div>
              ) : adminUsers.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-400">
                  {language === 'fa' ? 'هیچ کاربری یافت نشد.' : 'No users registered yet.'}
                </div>
              ) : (
                <table className="w-full text-left rtl:text-right border-collapse text-xs">
                  <thead className="sticky top-0 bg-neutral-100/90 dark:bg-zinc-900/90 backdrop-blur-md text-[10px] font-mono uppercase text-neutral-400 dark:text-zinc-500 border-b border-neutral-200/80 dark:border-white/10">
                    <tr>
                      <th className="py-2 px-3">{language === 'fa' ? 'کاربر' : 'User'}</th>
                      <th className="py-2 px-3">{language === 'fa' ? 'ایمیل' : 'Email'}</th>
                      <th className="py-2 px-3">{language === 'fa' ? 'طرح' : 'Plan'}</th>
                      <th className="py-2 px-3">{language === 'fa' ? 'تاریخ ثبت' : 'Registered'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/50 dark:divide-white/5 font-sans">
                    {adminUsers
                      .filter((u) =>
                        !userSearchTerm ||
                        u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                        u.name.toLowerCase().includes(userSearchTerm.toLowerCase())
                      )
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <td className="py-2 px-3">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <div className="w-6 h-6 rounded-lg bg-neutral-200 dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <span className="font-bold text-neutral-900 dark:text-zinc-100 truncate max-w-[110px]">
                                {u.name || 'Anonymous'}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-neutral-600 dark:text-zinc-400 truncate max-w-[140px]">
                            {u.email}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              u.subscriptionPlan === 'ENTERPRISE'
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                : u.subscriptionPlan === 'PRO'
                                ? 'bg-black dark:bg-white text-white dark:text-black'
                                : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-zinc-400'
                            }`}>
                              {u.subscriptionPlan || 'FREE'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-[10px] font-mono text-neutral-400 whitespace-nowrap">
                            {new Date(u.createdAt).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: PREFERENCES (THEME & LANGUAGE) */}
        {activeTab === 'preferences' && (
          <div className="space-y-5">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-zinc-800">
              <div>
                <span className="text-xs font-bold block text-neutral-900 dark:text-zinc-100">{t.themeLabel}</span>
                <span className="text-[11px] text-neutral-500 dark:text-zinc-400">
                  {language === 'fa' ? 'انتخاب حالت تیره یا روشن رابط کاربری' : 'Choose dark or light visual interface'}
                </span>
              </div>

              <div className="flex items-center gap-1 p-0.5 bg-neutral-100 dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => onSetDarkMode ? onSetDarkMode(false) : (darkMode && onToggleDarkMode())}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    !darkMode
                      ? 'bg-white dark:bg-zinc-800 text-neutral-950 dark:text-white shadow-xs font-bold'
                      : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'fa' ? 'روشن' : 'Light'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSetDarkMode ? onSetDarkMode(true) : (!darkMode && onToggleDarkMode())}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    darkMode
                      ? 'bg-white dark:bg-zinc-800 text-neutral-950 dark:text-white shadow-xs font-bold'
                      : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-neutral-700 dark:text-zinc-300" />
                  <span>{language === 'fa' ? 'تاریک' : 'Dark'}</span>
                </button>
              </div>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold block">{t.languageLabel}</span>
                <span className="text-[11px] text-neutral-400">
                  {language === 'fa' ? 'قلم وزیرمتن و چیدمان راست‌به‌چپ (RTL)' : 'Supports English and Persian with Vazirmatn font'}
                </span>
              </div>

              <div className="flex items-center gap-1 p-0.5 bg-neutral-100 dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => onSetLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    language === 'en' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => onSetLanguage('fa')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer font-sans ${
                    language === 'fa' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  فارسی
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-zinc-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.navSignOut}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-neutral-300 dark:border-zinc-700 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-xs font-bold transition-colors cursor-pointer"
          >
            {language === 'fa' ? 'بستن' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
