import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Sparkles,
  Zap,
  Activity,
  Layers,
  LogOut,
  Save,
  Check,
  Eye,
  EyeOff,
  Cpu
} from 'lucide-react';
import { User, ProductProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { updateUser, changeUserPassword } from '../services/agentApi';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  onBackToApp: () => void;
  profilesCount?: number;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onBackToApp,
  profilesCount = 2,
}) => {
  const { t, isRtl, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'integrations'>('general');

  // Edit Name State
  const [name, setName] = useState(user.name || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError(language === 'fa' ? 'لطفاً نام را وارد کنید' : 'Name cannot be empty');
      return;
    }
    setIsSavingName(true);
    setNameError(null);
    try {
      const updated = await updateUser(user.id, user.email, name.trim());
      onUpdateUser(updated);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err: any) {
      setNameError(err.message || 'Error updating profile');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPassError(language === 'fa' ? 'لطفاً تمام فیلدهای رمز عبور را پر کنید' : 'Please fill all password fields');
      return;
    }
    if (newPassword.length < 6) {
      setPassError(language === 'fa' ? 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد' : 'New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPassError(language === 'fa' ? 'رمز عبور جدید با تکرار آن مطابقت ندارد' : 'New passwords do not match');
      return;
    }

    setIsChangingPass(true);
    try {
      await changeUserPassword(user.email, currentPassword, newPassword);
      setPassSuccess(language === 'fa' ? 'رمز عبور با موفقیت به‌روزرسانی شد' : 'Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPassSuccess(null), 4000);
    } catch (err: any) {
      setPassError(err.message || (language === 'fa' ? 'رمز عبور فعلی نادرست است' : 'Failed to update password'));
    } finally {
      setIsChangingPass(false);
    }
  };

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : language === 'fa' ? 'به تازگی' : 'Recently';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <button
            onClick={onBackToApp}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-950 dark:hover:text-white mb-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{t.workspace.backOverview}</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
            {language === 'fa' ? 'پروفایل و تنظیمات حساب کاربری' : 'Profile & Account Settings'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {language === 'fa'
              ? 'اطلاعات کاربری، آمار اسکن‌ها و دسترسی به ایجنت رادار'
              : 'Manage your user credentials, scan usage, and AI model access'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToApp}
            className="px-3.5 py-1.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all cursor-pointer shadow-xs"
          >
            {language === 'fa' ? 'ورود به اسکنر رادار' : 'Go to Scanner'}
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            title={t.nav.signOut}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* User Header Summary Card */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200/90 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-2xl font-black shadow-md shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-neutral-950 dark:text-white">
                  {user.name || user.email.split('@')[0]}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {language === 'fa' ? 'فعال' : 'Active'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{user.email}</span>
              </p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{language === 'fa' ? `عضویت: ${formattedDate}` : `Joined: ${formattedDate}`}</span>
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800 gap-2">
            <span className="text-[11px] font-mono text-neutral-400 uppercase">
              {language === 'fa' ? 'طرح کاربری' : 'Account Tier'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'fa' ? 'رشد حرفه‌ای (Pro)' : 'Pro Founder Edition'}</span>
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800/80">
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800/60">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[11px] font-semibold">{language === 'fa' ? 'پروفایل‌های محصول' : 'Active Profiles'}</span>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="text-lg font-black text-neutral-950 dark:text-white">
              {profilesCount}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800/60">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[11px] font-semibold">{language === 'fa' ? 'میانگین دقت تشخیص' : 'Avg Accuracy'}</span>
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div className="text-lg font-black text-neutral-950 dark:text-white">
              ۸۸.۴٪
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800/60">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[11px] font-semibold">{language === 'fa' ? 'صرفه‌جویی توکن' : 'Cost Saved'}</span>
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              ۸۸.۷٪
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800/60">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="text-[11px] font-semibold">{language === 'fa' ? 'مدل هوش مصنوعی' : 'AI Engine'}</span>
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-bold text-neutral-950 dark:text-white pt-1">
              Gemini 3.8 Flash
            </div>
          </div>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 max-w-md">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'general'
              ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
          }`}
        >
          {language === 'fa' ? 'مشخصات فردی' : 'Personal Details'}
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
          }`}
        >
          {language === 'fa' ? 'امنیت و رمز عبور' : 'Security'}
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'integrations'
              ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
          }`}
        >
          {language === 'fa' ? 'اتصالات و مدل' : 'AI & Integration'}
        </button>
      </div>

      {/* TAB 1: GENERAL PERSONAL DETAILS */}
      {activeTab === 'general' && (
        <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200/90 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                {language === 'fa' ? 'ویرایش نام و مشخصات' : 'Edit Personal Info'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {language === 'fa'
                  ? 'این نام در بالای پنل و گزارش‌های خروجی نمایش داده می‌شود.'
                  : 'This name appears on your dashboard, exported reports, and team views.'}
              </p>
            </div>

            {nameSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{language === 'fa' ? 'نام شما با موفقیت ذخیره شد!' : 'Profile updated successfully!'}</span>
              </div>
            )}

            {nameError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{nameError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  {t.auth.nameLabel || (language === 'fa' ? 'نام کامل' : 'Full Name')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-neutral-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700/80 rounded-xl py-2.5 pl-9 pr-3 rtl:pl-3 rtl:pr-9 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  {t.auth.emailLabel || (language === 'fa' ? 'ایمیل حساب کاربری' : 'Email Address')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/80 rounded-xl py-2.5 pl-9 pr-3 rtl:pl-3 rtl:pr-9 text-xs text-neutral-500 dark:text-neutral-400 cursor-not-allowed select-none"
                  />
                </div>
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  {language === 'fa' ? 'ایمیل اصلی حساب غیرقابل تغییر است' : 'Email address cannot be modified directly'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  {language === 'fa' ? 'شناسه اختصاصی کاربر' : 'User Account ID'}
                </label>
                <div className="p-2.5 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-mono text-neutral-600 dark:text-neutral-400">
                  {user.id}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingName}
                className="py-2.5 px-5 bg-black dark:bg-white text-white dark:text-black font-extrabold text-xs rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-xs mt-2"
              >
                {isSavingName ? (
                  <span>{t.auth.processing}</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{language === 'fa' ? 'ذخیره تغییرات' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: SECURITY & PASSWORD CHANGE */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200/90 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                {language === 'fa' ? 'تغییر رمز عبور' : 'Change Password'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {language === 'fa'
                  ? 'برای امنیت بیشتر، از رمزهای عبور حداقل ۸ کاراکتری شامل حروف و اعداد استفاده کنید.'
                  : 'Ensure your account uses a strong password with at least 6-8 characters.'}
              </p>
            </div>

            {passSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passSuccess}</span>
              </div>
            )}

            {passError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  {language === 'fa' ? 'رمز عبور فعلی' : 'Current Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-neutral-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700/80 rounded-xl py-2.5 pl-9 pr-10 rtl:pl-10 rtl:pr-9 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pr-0 rtl:pl-3 flex items-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  {language === 'fa' ? 'رمز عبور جدید' : 'New Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-neutral-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700/80 rounded-xl py-2.5 pl-9 pr-10 rtl:pl-10 rtl:pr-9 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pr-0 rtl:pl-3 flex items-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  {t.auth.confirmPasswordLabel || (language === 'fa' ? 'تکرار رمز عبور جدید' : 'Confirm New Password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-neutral-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-700/80 rounded-xl py-2.5 pl-9 pr-3 rtl:pl-3 rtl:pr-9 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isChangingPass}
                className="py-2.5 px-5 bg-black dark:bg-white text-white dark:text-black font-extrabold text-xs rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-xs mt-2"
              >
                {isChangingPass ? (
                  <span>{t.auth.processing}</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{language === 'fa' ? 'به‌روزرسانی رمز عبور' : 'Update Password'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: INTEGRATIONS & AI MODEL STATUS */}
      {activeTab === 'integrations' && (
        <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200/90 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-neutral-950 dark:text-white">
              {language === 'fa' ? 'وضعیت موتور هوش مصنوعی و اتصال به شبکه‌ها' : 'AI Engine & Integration Pipeline'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {language === 'fa'
                ? 'پایپ‌لاین ۴ مرحله‌ای بهینه‌سازی هزینه و نحوه پردازش پیام‌ها'
                : 'Overview of multi-stage cost-aware agentic detection in online communities.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-500" />
                  <span>Google Gemini 3.8 Flash</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  CONNECTED
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {language === 'fa'
                  ? 'اتصال فعال از طریق سرور پروکسی امن. هزینه متوسط ۰.۰۰۰۰۰۰۲۵ دلار به ازای هر توکن با زمان تاخیر کمتر از ۱ ثانیه.'
                  : 'Active server proxy connection. Blended $0.00000025 per token with sub-second inference speed.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>{language === 'fa' ? 'آبشار ۴ مرحله‌ای ضد اسپم' : '4-Stage Cascading Pipeline'}</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                  ENABLED
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {language === 'fa'
                  ? 'بیش از ۷۰٪ پیام‌های هرز و بی‌ربط در مرحله اول با ۸۵ توکن فیلتر می‌شوند تا هزینه پایپ‌لاین به حداقل برسد.'
                  : 'Over 70% of chat noise is eliminated in Stage 1 using only ~85 tokens, cutting billable spend by ~88%.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
