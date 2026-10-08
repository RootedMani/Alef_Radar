import React, { useState } from 'react';
import {
  Radar,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Layers,
  MessageSquare,
  CheckCircle2,
  Filter,
  DollarSign,
  Cpu,
  BookOpen,
  Eye,
  Zap,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDatasets: (type: 'programming' | 'eyewear') => void;
  onViewDocs: () => void;
  language?: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreDatasets,
  onViewDocs,
  language = 'en',
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const t = translations[language];
  const isRtl = language === 'fa';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const faqs = language === 'fa' ? [
    {
      q: 'الف رادار چگونه هزینه توکن‌های هوش مصنوعی را ۸۸٪ کاهش می‌دهد؟',
      a: 'به جای ارسال تک‌تک پیام‌های جامعه به یک پرامپت سنگین گران‌قیمت، آبشار ۴ مرحله‌ای ما یک غربالگری بسیار ارزان در مرحله اول (۰.۰۰۰۰۱ دلار به ازای هر پیام) اعمال می‌کند. بیش از ۷۰٪ میم‌ها، هرزنامه‌ها و پیام‌های نامربوط بلافاصله کنار گذاشته می‌شوند و تنها پیام‌های دارای قصد خرید وارد مراحل استدلال عمیق‌تر و تولید پاسخ می‌شوند.'
    },
    {
      q: 'آیا پاسخ‌های پیشنهادی شبیه به ربات و اسپم به نظر می‌رسند؟',
      a: 'خیر، به هیچ وجه. الف رادار بر اساس اصول تعامل همتا-به-همتا و ارزش‌محور طراحی شده است. ایجنت ابتدا با نقطه درد کاربر همدردی کرده و راهکار عملی ارائه می‌دهد و تنها در صورت تناسب کامل، محصول شما را به شیوه‌ای طبیعی معرفی می‌کند تا از مسدود شدن حساب یا واکنش منفی جامعه جلوگیری شود.'
    },
    {
      q: 'آیا امکان اتصال فیدهای سفارشی و محصول اختصاصی خودم وجود دارد؟',
      a: 'بله، می‌توانید فایل‌های CSV، JSON یا متن چت‌های آنلاین خود را بارگذاری کنید، و چندین پروفایل محصول با نقاط درد مشخص، لحن دلخواه و قوانین منفی منع‌پاسخ بسازید.'
    },
    {
      q: 'چه مدل هوش مصنوعی در قلب این ایجنت قرار دارد؟',
      a: 'الف رادار از مدل سریع و قدرتمند Google Gemini 3.8 Flash بهره می‌برد که خروجی‌های ساختاریافته JSON با کیفیت بالا و کمترین تأخیر زمانی تولید می‌کند.'
    }
  ] : [
    {
      q: 'How does Alef Radar reduce LLM token costs by 88%?',
      a: 'Instead of passing every community chatter message to a large reasoning prompt, our 4-stage cascade applies ultra-cheap lexical screening at Stage 1 ($0.00001 per message). Over 70% of memes, bot spam, and irrelevant posts are dropped instantly. Only high-conviction buying intent triggers the deeper semantic reasoning and reply generation stages.'
    },
    {
      q: 'Will replies look like automated bot spam?',
      a: 'Never. Alef Radar is programmed with value-first peer conversation guidelines. The agent prioritizes empathizing with the specific user problem and offering actionable advice first, only subtly introducing your solution where genuinely relevant, preserving community trust and preventing moderator bans.'
    },
    {
      q: 'Can I connect custom community streams and my own product profile?',
      a: 'Yes. You can paste custom feeds or integrate stream webhooks, and define multiple target product profiles with specific audience pain points, tone of voice, price point, and strict exclusion rules.'
    },
    {
      q: 'What underlying AI model powers the agent?',
      a: 'Alef Radar runs on Google Gemini 3.8 Flash, delivering sub-second inference speeds with reliable structured JSON outputs and exceptionally low inference pricing.'
    }
  ];

  return (
    <div className="space-y-24 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Hero Section */}
      <section className="pt-8 sm:pt-14 pb-4 text-center max-w-4xl mx-auto px-4">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1 rounded-full border border-neutral-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-mono font-bold text-neutral-800 dark:text-zinc-200 mb-6 shadow-xs">
          <Radar className="w-3.5 h-3.5 text-black dark:text-white" />
          <span>{t.heroEyebrow}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-950 dark:text-white tracking-tight leading-[1.12]">
          {t.heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-neutral-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rtl:space-x-reverse px-7 py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-extrabold text-sm tracking-wide shadow-md hover:bg-neutral-800 dark:hover:bg-zinc-200 transition-all cursor-pointer"
          >
            <span>{t.launchScannerBtn}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>

          <button
            onClick={onViewDocs}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rtl:space-x-reverse px-6 py-3.5 rounded-xl border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-900 dark:text-white font-bold text-sm transition-all cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            <span>{t.docsBtn}</span>
          </button>
        </div>

        {/* Micro Telemetry Metrics */}
        <div className="mt-14 pt-8 border-t border-neutral-200 dark:border-zinc-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white font-mono">88.7%</div>
            <div className="text-xs text-neutral-500 dark:text-zinc-400 font-medium mt-1">{t.statCostSaved}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white font-mono">{language === 'fa' ? '۴ مرحله' : '4 Stages'}</div>
            <div className="text-xs text-neutral-500 dark:text-zinc-400 font-medium mt-1">{t.statStages}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white font-mono">&lt; 140 ms</div>
            <div className="text-xs text-neutral-500 dark:text-zinc-400 font-medium mt-1">{t.statLatency}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white font-mono">0%</div>
            <div className="text-xs text-neutral-500 dark:text-zinc-400 font-medium mt-1">{t.statZeroSpam}</div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
            {language === 'fa' ? 'معماری خط‌لوله رادار' : 'Pipeline Architecture'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white mt-1">
            {t.workflowTitle}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-zinc-400 mt-2">
            {t.workflowSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-7 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-neutral-400 dark:text-zinc-500 mb-3">01 // PROFILE</div>
              <h3 className="text-lg font-extrabold text-neutral-950 dark:text-white mb-2">
                {t.step1Title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-zinc-400 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-zinc-800 flex items-center justify-between text-xs font-mono text-neutral-400 dark:text-zinc-500">
              <span>{language === 'fa' ? 'راه‌اندازی در ۶۰ ثانیه' : 'Ready in 60s'}</span>
              <span>{language === 'fa' ? 'سفارشی‌سازی کامل' : 'Fully Customizable'}</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-950 dark:border-white shadow-sm flex flex-col justify-between ring-1 ring-neutral-950 dark:ring-white">
            <div>
              <div className="text-xs font-mono font-bold text-neutral-950 dark:text-white mb-3">02 // 4-STAGE CASCADE</div>
              <h3 className="text-lg font-extrabold text-neutral-950 dark:text-white mb-2">
                {t.step2Title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-zinc-400 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-zinc-800 flex items-center justify-between text-xs font-mono text-neutral-950 dark:text-white font-bold">
              <span>88.7% {language === 'fa' ? 'صرفه‌جویی هزینه' : 'Cost Pruned'}</span>
              <span>Gemini 3.8 Flash</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-neutral-400 dark:text-zinc-500 mb-3">03 // ENGAGEMENT</div>
              <h3 className="text-lg font-extrabold text-neutral-950 dark:text-white mb-2">
                {t.step3Title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-zinc-400 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-zinc-800 flex items-center justify-between text-xs font-mono text-neutral-400 dark:text-zinc-500">
              <span>{language === 'fa' ? 'کپی با ۱ کلیک' : '1-Click Copy'}</span>
              <span>{language === 'fa' ? 'بدون گزارش اسپم' : 'Zero Account Bans'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Cost-Aware Advantage (Comparison Grid) */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 shadow-sm">
          <div className="text-center max-w-lg mx-auto mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
              {language === 'fa' ? 'اعتبارسنجی اقتصادی' : 'Economic Validation'}
            </span>
            <h2 className="text-2xl font-black text-neutral-950 dark:text-white mt-1">
              {t.economicTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Manual */}
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50/60 dark:bg-zinc-950/40 text-center">
              <div className="text-xs font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wide">{t.manualBrowsing}</div>
              <div className="text-2xl font-black text-neutral-950 dark:text-white mt-2 font-mono">20+ {language === 'fa' ? 'ساعت/هفته' : 'Hours/wk'}</div>
              <p className="text-xs text-neutral-600 dark:text-zinc-400 mt-2 leading-relaxed">
                {language === 'fa'
                  ? 'بررسی دستی کانال‌های دیسکورد و ردیت؛ ۹۵٪ زمان روی چت‌های نامربوط تلف شده و پیام‌ها ساعت‌ها دیر ارسال می‌شوند.'
                  : 'Growth leads manually reading through Discord and Reddit. 95% wasted on banter; replies arrive hours too late.'}
              </p>
            </div>

            {/* Naive AI */}
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50/60 dark:bg-zinc-950/40 text-center">
              <div className="text-xs font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wide">{t.naiveAi}</div>
              <div className="text-2xl font-black text-neutral-950 dark:text-white mt-2 font-mono">$144.00 <span className="text-xs font-normal">/ mo</span></div>
              <p className="text-xs text-neutral-600 dark:text-zinc-400 mt-2 leading-relaxed">
                {language === 'fa'
                  ? 'ارسال ۱۲۰۰ توکن به مدل‌های سنگین روی ۱۰,۰۰۰ پیام ماهانه بودجه را روی ربات‌ها و جوک‌ها می‌سوزاند.'
                  : 'Pumping 1,200 tokens per message through heavy LLMs across 10,000 community messages burns budget on memes and bots.'}
              </p>
            </div>

            {/* OpportunityRadar */}
            <div className="p-5 rounded-xl border border-neutral-950 dark:border-white bg-neutral-950 dark:bg-white text-white dark:text-black text-center shadow-md">
              <div className="text-xs font-bold uppercase tracking-wide opacity-80">{t.radarCascade}</div>
              <div className="text-2xl font-black mt-2 font-mono">$16.24 <span className="text-xs font-normal opacity-70">/ mo</span></div>
              <p className="text-xs text-neutral-300 dark:text-neutral-700 mt-2 leading-relaxed">
                {language === 'fa'
                  ? '۷۰٪ در مرحله ۱ (۰.۰۰۰۰۱ دلار) حذف شده و تنها سرنخ‌های طلایی به مرحله نهایی می‌رسند و هزینه را ۸۸.۷٪ کاهش می‌دهند.'
                  : '70% pruned at Stage 1 ($0.00001/msg). Only verified buyer leads reach final generation, slashing bills by 88.7%.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Production Datasets Showcase */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="border border-neutral-200 dark:border-zinc-800 rounded-3xl p-8 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200 dark:border-zinc-800">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
                {language === 'fa' ? 'جریان‌های آزمایشی آماده' : 'Live Pre-loaded Streams'}
              </span>
              <h2 className="text-2xl font-black text-neutral-950 dark:text-white mt-0.5">
                {language === 'fa' ? 'آزمایش با جریان‌های آماده مکالمات آنلاین' : 'Test With Pre-Loaded Community Datasets'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-1">
                {language === 'fa'
                  ? 'پیام‌های واقعی شامل خریداران بالقوه، پرسش‌های سطحی و هرزنامه‌های ربات‌ها.'
                  : 'Authentic community messages containing urgent buyers, weak curiosities, and spam noise.'}
              </p>
            </div>

            <button
              onClick={onGetStarted}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs hover:opacity-90 transition-all self-start md:self-auto cursor-pointer"
            >
              <span>{language === 'fa' ? 'ورود به اسکنر' : 'Test Streams in Scanner'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Dataset 1 */}
            <div
              onClick={() => onExploreDatasets('programming')}
              className="p-5 rounded-2xl border border-neutral-200 dark:border-zinc-800 hover:border-neutral-950 dark:hover:border-white transition-all cursor-pointer bg-neutral-50/50 dark:bg-zinc-950/40 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-neutral-500 dark:text-zinc-400">
                  {language === 'fa' ? 'فید ۰۱ // آموزش و توسعه نرم‌افزار' : 'FEED 01 // EDTECH & SOFTWARE'}
                </span>
                <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                  {language === 'fa' ? 'اجرای تست ←' : 'Run Test →'}
                </span>
              </div>
              <h4 className="font-extrabold text-neutral-950 dark:text-white text-base mb-1">
                {language === 'fa' ? 'دوره آموزش پایتون و تغییر مسیر شغلی' : 'Programming Course & Career Pivot Community'}
              </h4>
              <p className="text-xs text-neutral-600 dark:text-zinc-400 leading-relaxed mb-3">
                {language === 'fa'
                  ? 'پیام‌های ردیت r/learnprogramming و دیسکورد؛ افراد گیر افتاده در آموزش‌های تکراری همراه با اسپم ایردراپ.'
                  : 'Scraped from Reddit r/learnprogramming, Discord developer chats, and tech boards. Features career switchers in tutorial hell, questions, and crypto spam.'}
              </p>
              <div className="text-[11px] font-mono text-neutral-500 dark:text-zinc-400">
                Target Profile: DevCraft Python Career Accelerator
              </div>
            </div>

            {/* Dataset 2 */}
            <div
              onClick={() => onExploreDatasets('eyewear')}
              className="p-5 rounded-2xl border border-neutral-200 dark:border-zinc-800 hover:border-neutral-950 dark:hover:border-white transition-all cursor-pointer bg-neutral-50/50 dark:bg-zinc-950/40 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-neutral-500 dark:text-zinc-400">
                  {language === 'fa' ? 'فید ۰۲ // سخت‌افزار و ارگونومی' : 'FEED 02 // DTC HARDWARE & ERGONOMICS'}
                </span>
                <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                  {language === 'fa' ? 'اجرای تست ←' : 'Run Test →'}
                </span>
              </div>
              <h4 className="font-extrabold text-neutral-950 dark:text-white text-base mb-1">
                {language === 'fa' ? 'عینک بلوکنترل و خستگی چشم مانیتور' : 'Blue-Light Glasses & Screen Fatigue Feed'}
              </h4>
              <p className="text-xs text-neutral-600 dark:text-zinc-400 leading-relaxed mb-3">
                {language === 'fa'
                  ? 'مکالمات توییتر و ردیت از برنامه‌نویسان و تحلیل‌گرانی که از سوزش چشم و میگرن مانیتور رنج می‌برند.'
                  : 'Twitter/X and Reddit threads from remote software engineers, analysts, and traders experiencing 10-hour screen migraines and blurred vision.'}
              </p>
              <div className="text-[11px] font-mono text-neutral-500 dark:text-zinc-400">
                Target Profile: LuminaShield Precision Eyewear
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Plans Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
            {language === 'fa' ? 'تعرفه‌های شفاف' : 'Predictable Pricing'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white mt-1">
            {t.pricingTitle}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-zinc-400 mt-2">
            {t.pricingSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">{t.planFree}</div>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-black text-neutral-950 dark:text-white font-mono">$0</span>
                <span className="text-xs text-neutral-500 dark:text-zinc-400 ml-1 rtl:mr-1">/ {language === 'fa' ? 'همیشگی' : 'forever'}</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-zinc-400 mt-2">
                {language === 'fa' ? 'مناسب ارزیابی خط‌لوله ایجنت و اسکن دسته‌های پیام دستی.' : 'Ideal for evaluating the agent pipeline and scanning manual community message batches.'}
              </p>
              <ul className="mt-5 space-y-2 text-xs text-neutral-700 dark:text-zinc-300">
                <li className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 dark:text-white shrink-0" />
                  <span>500 {language === 'fa' ? 'پیام اسکن شده / ماه' : 'scanned posts / mo'}</span>
                </li>
                <li className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 dark:text-white shrink-0" />
                  <span>{language === 'fa' ? '۲ پروفایل محصول فعال' : '2 Active Product Profiles'}</span>
                </li>
                <li className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 dark:text-white shrink-0" />
                  <span>{language === 'fa' ? 'نمودار کامل آبشار ۴ مرحله‌ای' : 'Full 4-Stage cascade visualizer'}</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onGetStarted}
              className="mt-6 w-full py-2.5 rounded-xl border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-700 text-xs font-bold text-neutral-900 dark:text-white transition-colors cursor-pointer"
            >
              {language === 'fa' ? 'شروع رایگان' : 'Get Started Free'}
            </button>
          </div>

          {/* Pro Growth Plan */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-950 dark:border-white shadow-md ring-1 ring-neutral-950 dark:ring-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-950 dark:text-white uppercase tracking-wider">{t.planPro}</span>
                <span className="text-[10px] font-mono font-bold bg-neutral-950 dark:bg-white text-white dark:text-black px-2 py-0.5 rounded-full">POPULAR</span>
              </div>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-black text-neutral-950 dark:text-white font-mono">$49</span>
                <span className="text-xs text-neutral-500 dark:text-zinc-400 ml-1 rtl:mr-1">/ {language === 'fa' ? 'ماهانه' : 'month'}</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-zinc-400 mt-2">
                {language === 'fa' ? 'برای بنیان‌گذاران، بازاریابان ساس و آژانس‌های نظارت روزانه کانال‌ها.' : 'For active founders, SaaS marketers, and growth agencies monitoring daily channels.'}
              </p>
              <ul className="mt-5 space-y-2 text-xs text-neutral-700 dark:text-zinc-300">
                <li className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-950 dark:text-white shrink-0" />
                  <span>15,000 {language === 'fa' ? 'پیام اسکن شده / ماه' : 'scanned posts / mo'}</span>
                </li>
                <li className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-950 dark:text-white shrink-0" />
                  <span>{language === 'fa' ? 'پروفایل نامحدود محصولات' : 'Unlimited Product Profiles'}</span>
                </li>
                <li className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-950 dark:text-white shrink-0" />
                  <span>{language === 'fa' ? 'ورودی زنده وب‌هوک و API' : 'Real-time webhook triggers'}</span>
                </li>
                <li className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-950 dark:text-white shrink-0" />
                  <span>{language === 'fa' ? 'تولید فوری پاسخ‌های خریدار' : 'Instant 1-click reply drafting'}</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onGetStarted}
              className="mt-6 w-full py-2.5 rounded-xl bg-black dark:bg-white hover:opacity-90 text-xs font-bold text-white dark:text-black transition-colors cursor-pointer shadow-xs"
            >
              {language === 'fa' ? 'آزمایش ۱۴ روزه' : 'Start 14-Day Trial'}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wider">{t.planEnterprise}</div>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-black text-neutral-950 dark:text-white font-mono">$199</span>
                <span className="text-xs text-neutral-500 dark:text-zinc-400 ml-1 rtl:mr-1">/ {language === 'fa' ? 'ماهانه' : 'month'}</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-zinc-400 mt-2">
                {language === 'fa' ? 'جریان‌های سنگین، سینک مستقیم به CRM، و لحن فاین‌تون شده.' : 'High-volume streaming listeners, dedicated webhooks, CRM sync, and custom model fine-tuning.'}
              </p>
              <ul className="mt-5 space-y-2 text-xs text-neutral-700 dark:text-zinc-300">
                <li className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 dark:text-white shrink-0" />
                  <span>{language === 'fa' ? 'اسکن نامحدود پیام‌ها' : 'Unlimited scanned posts'}</span>
                </li>
                <li className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 dark:text-white shrink-0" />
                  <span>{language === 'fa' ? 'سینک با HubSpot و Salesforce' : 'Direct HubSpot & Salesforce sync'}</span>
                </li>
                <li className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 dark:text-white shrink-0" />
                  <span>{language === 'fa' ? 'تنظیم مدل اختصاصی' : 'Custom tone fine-tuning'}</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onGetStarted}
              className="mt-6 w-full py-2.5 rounded-xl border border-neutral-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-700 text-xs font-bold text-neutral-900 dark:text-white transition-colors cursor-pointer"
            >
              {language === 'fa' ? 'تماس با فروش' : 'Contact Sales'}
            </button>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center max-w-lg mx-auto mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
            {language === 'fa' ? 'پاسخ به سوالات' : 'Got Questions?'}
          </span>
          <h2 className="text-2xl font-black text-neutral-950 dark:text-white mt-1">
            {t.faqTitle}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-neutral-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left rtl:text-right text-xs sm:text-sm font-bold text-neutral-900 dark:text-white cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 dark:text-zinc-500 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-black dark:text-white' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-neutral-600 dark:text-zinc-400 leading-relaxed border-t border-neutral-100 dark:border-zinc-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-10 rounded-3xl bg-neutral-950 dark:bg-white text-white dark:text-black shadow-xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t.ctaTitle}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-600 max-w-xl mx-auto leading-relaxed">
            {t.ctaSubtitle}
          </p>
          <div className="pt-2">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-8 py-3.5 rounded-xl bg-white dark:bg-black text-black dark:text-white font-extrabold text-sm hover:opacity-90 transition-all cursor-pointer shadow-md"
            >
              <span>{t.ctaBtn}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
