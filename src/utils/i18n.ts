export type Language = 'en' | 'fa';

export interface Translations {
  appName: string;
  tagline: string;
  aiAgentBadge: string;
  navOverview: string;
  navScanner: string;
  navDocs: string;
  navSignIn: string;
  navGetStarted: string;
  navSignOut: string;
  navProfile: string;

  // Landing Page
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  launchScannerBtn: string;
  docsBtn: string;
  statCostSaved: string;
  statStages: string;
  statLatency: string;
  statZeroSpam: string;
  workflowTitle: string;
  workflowSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  economicTitle: string;
  economicSubtitle: string;
  manualBrowsing: string;
  naiveAi: string;
  radarCascade: string;
  pricingTitle: string;
  pricingSubtitle: string;
  planFree: string;
  planPro: string;
  planEnterprise: string;
  faqTitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaBtn: string;

  // Workspace
  workspaceTitle: string;
  workspaceSubtitle: string;
  backToOverview: string;
  targetProfileTitle: string;
  targetProfileSubtitle: string;
  feedTitle: string;
  feedSubtitle: string;
  runAgentBtn: string;
  agentRunning: string;
  uploadTab: string;
  pasteTab: string;
  benchmarksTab: string;
  addMessageBtn: string;
  loadedPosts: string;
  step2StreamLabel: string;
  loadBatchBtn: string;
  benchmark01Badge: string;
  benchmark01Title: string;
  benchmark01Desc: string;
  benchmark02Badge: string;
  benchmark02Title: string;
  benchmark02Desc: string;
  uploadTitle: string;
  uploadDesc: string;
  uploadSub: string;
  sampleTemplateHint: string;
  loadSampleTemplateBtn: string;
  pasteLabel: string;
  pasteSub: string;
  parseIngestBtn: string;
  searchBatchPlaceholder: string;
  noMessagesLoaded: string;
  noMessagesSub: string;
  addModalTitle: string;
  addModalDesc: string;
  authorLabel: string;
  platformLabel: string;
  communityLabel: string;
  messageTextLabel: string;
  insertMessageBtn: string;
  score: string;
  decision: string;
  actNow: string;
  watch: string;
  noise: string;

  // Results Dashboard
  resultsTitle: string;
  resultsSubtitle: string;
  copyReplyBtn: string;
  copiedBtn: string;
  markSentBtn: string;
  sentBtn: string;
  exportCsvBtn: string;
  exportJsonBtn: string;
  highIntentLeads: string;
  watchNurture: string;
  noisePruned: string;
  costSavedMetric: string;
  whyItWorks: string;

  // Profile Modal
  profileTitle: string;
  profileSubtitle: string;
  displayNameLabel: string;
  emailLabel: string;
  subscriptionTab: string;
  accountTab: string;
  apiTab: string;
  currentPlanLabel: string;
  monthlyQuotaLabel: string;
  postsScanned: string;
  upgradeToPro: string;
  downgradeToFree: string;
  saveChangesBtn: string;
  savedSuccess: string;
  apiKeyLabel: string;
  copyApiKey: string;
  themeLabel: string;
  lightMode: string;
  darkMode: string;
  languageLabel: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Alef Radar',
    tagline: 'Autonomous Community Lead Intelligence',
    aiAgentBadge: 'AI AGENT',
    navOverview: 'Overview',
    navScanner: 'Radar Scanner',
    navDocs: 'Architecture & Specs',
    navSignIn: 'Sign In',
    navGetStarted: 'Get Started Free',
    navSignOut: 'Sign Out',
    navProfile: 'Account Profile',

    heroEyebrow: 'AUTONOMOUS COMMUNITY INTELLIGENCE // AI LEAD AGENT',
    heroTitle: 'Turn Public Discussions Into High-Converting Customer Pipelines',
    heroSubtitle: 'Alef Radar scans Reddit, Telegram, X, and Discord feeds, eliminates 75% of noise for micro-cents, and crafts authentic, peer-level replies the moment prospects express purchasing pain points.',
    launchScannerBtn: 'Launch Radar Scanner (Free)',
    docsBtn: 'Architecture & Specifications',
    statCostSaved: 'Inference Cost Savings',
    statStages: 'State Machine Cascade',
    statLatency: 'Average Triage Latency',
    statZeroSpam: 'Value-First Suggested Outreach',
    workflowTitle: 'How The Agentic Cascade Operates',
    workflowSubtitle: 'Instead of burning budgets running monolithic models across entire chat logs, Alef Radar funnels messages through an intelligent 4-tier state machine.',
    step1Title: 'Configure Product Profile',
    step1Desc: 'Define your exact customer pain points, value proposition, ideal persona, voice tone, and negative criteria to forbid awkward or out-of-place replies.',
    step2Title: 'Filter Noise & Assess Intent',
    step2Desc: 'Stage 1 cuts noise for $0.00001. Stages 2 and 3 evaluate implicit purchase urgency, specific friction points, and output a validated 0–100 opportunity score.',
    step3Title: 'Generate Natural Replies',
    step3Desc: 'Stage 4 runs strictly on Strong Fit leads, generating personalized, helpful advice that introduces your solution naturally without feeling like a marketing pitch.',
    economicTitle: 'Why Naive LLM Bots Fail at Real-World Scale',
    economicSubtitle: 'Monolithic single-prompt bots burn through token budgets on memes and bot chatter.',
    manualBrowsing: 'Manual Human Browsing',
    naiveAi: 'Naive Single-Prompt AI',
    radarCascade: 'Alef Radar Cascade',
    pricingTitle: 'Simple, Cost-Aware Subscription Tiers',
    pricingSubtitle: 'Start free, explore the cascade live, and upgrade when streaming live webhooks.',
    planFree: 'Free Starter',
    planPro: 'Pro Growth',
    planEnterprise: 'Enterprise Scale',
    faqTitle: 'Frequently Asked Questions',
    ctaTitle: 'Start Detecting High-Intent Customers Now',
    ctaSubtitle: 'Create your account or launch the interactive scanner immediately to test real stream triage and reply generation.',
    ctaBtn: 'Open Radar Scanner',

    workspaceTitle: 'Radar Detection Workspace',
    workspaceSubtitle: 'Configure your product criteria, load stream messages, and let the multi-stage agent find high-intent buyer leads.',
    backToOverview: 'Back to Product Overview',
    targetProfileTitle: 'Select Target Product Profile',
    targetProfileSubtitle: 'The agent tests incoming community pain points against these value propositions.',
    feedTitle: 'Data Ingestion & Live Community Feed',
    feedSubtitle: 'Import your own community files (CSV, JSON, text dumps), or test with pre-built benchmark datasets.',
    runAgentBtn: 'Run Radar Agent',
    agentRunning: 'Processing 4-Stage Cascade...',
    uploadTab: 'Import CSV / JSON File',
    pasteTab: 'Paste Raw Text / Chats',
    benchmarksTab: 'Curated Benchmarks',
    addMessageBtn: 'Add Custom Message',
    loadedPosts: 'Posts Ingested',
    step2StreamLabel: 'STEP 2 // COMMUNITY INCOMING STREAM',
    loadBatchBtn: 'Load Batch →',
    benchmark01Badge: 'BENCHMARK 01 // EDTECH & DEV',
    benchmark01Title: 'Programming Course & Career Pivot Feeds (8 Messages)',
    benchmark01Desc: 'Scraped from Reddit r/learnprogramming, Telegram developer groups, and Discord. Contains self-taught learners in tutorial hell, syntax bugs, and crypto airdrop bots.',
    benchmark02Badge: 'BENCHMARK 02 // HARDWARE & DTC',
    benchmark02Title: 'Blue-Light Glasses & Screen Eye Strain Feeds (8 Messages)',
    benchmark02Desc: 'Scraped from Twitter/X and Reddit threads with developers and knowledge workers suffering from dry eye fatigue, temple headaches, and discount spam.',
    uploadTitle: 'Click to upload or drag and drop your data file',
    uploadDesc: 'Accepts .CSV, .JSON, or .TSV exported from Reddit, Twitter, Discord, Telegram, or Google Sheets.',
    uploadSub: 'Automatic Column Auto-Detection • Max 5,000 rows',
    sampleTemplateHint: 'Supported CSV Column Headers: text, author, platform, community, timestamp (or auto-detected from row length).',
    loadSampleTemplateBtn: 'Load Sample CSV Template',
    pasteLabel: 'Paste Raw Multi-Line Messages, Chat Logs, or JSON Array:',
    pasteSub: 'Line breaks or JSON objects accepted',
    parseIngestBtn: 'Parse & Ingest Messages',
    searchBatchPlaceholder: 'Search batch...',
    noMessagesLoaded: 'No messages loaded in this stream.',
    noMessagesSub: 'Choose a benchmark above or upload your CSV/JSON data.',
    addModalTitle: 'Add Individual Post',
    addModalDesc: 'Insert a single community message to test how the agent handles specific wording.',
    authorLabel: 'Author / Handle',
    platformLabel: 'Platform',
    communityLabel: 'Source Community / Channel',
    messageTextLabel: 'Message Text',
    insertMessageBtn: 'Insert Message into Stream',
    score: 'Score',
    decision: 'Decision',
    actNow: 'Act Now',
    watch: 'Watch',
    noise: 'Noise',

    resultsTitle: 'Detected Lead Opportunities & Tailored Actions',
    resultsSubtitle: 'Matched against product profile criteria with authentic value-first suggested replies.',
    copyReplyBtn: 'Copy Reply',
    copiedBtn: 'Copied!',
    markSentBtn: 'Mark as Sent',
    sentBtn: 'Outreach Sent',
    exportCsvBtn: 'Export CSV',
    exportJsonBtn: 'Export JSON',
    highIntentLeads: 'High-Intent Leads',
    watchNurture: 'Watch & Nurture',
    noisePruned: 'Noise Pruned',
    costSavedMetric: 'Token Cost Saved',
    whyItWorks: 'Why it works',

    profileTitle: 'Account & Subscription Profile',
    profileSubtitle: 'Manage your personal details, subscription tier, monthly token quota, and developer API access.',
    displayNameLabel: 'Display Name',
    emailLabel: 'Email Address',
    subscriptionTab: 'Subscription & Quota',
    accountTab: 'Personal Info',
    apiTab: 'API & Developer Keys',
    currentPlanLabel: 'Current Plan Tier',
    monthlyQuotaLabel: 'Monthly Scanned Posts Quota',
    postsScanned: 'Posts Scanned This Month',
    upgradeToPro: 'Upgrade to Pro Growth ($49/mo)',
    downgradeToFree: 'Switch to Free Tier',
    saveChangesBtn: 'Save Profile Changes',
    savedSuccess: 'Profile successfully updated!',
    apiKeyLabel: 'Developer Ingestion API Key',
    copyApiKey: 'Copy API Key',
    themeLabel: 'Appearance Theme',
    lightMode: 'Light Theme',
    darkMode: 'Dark Theme',
    languageLabel: 'Display Language'
  },
  fa: {
    appName: 'Alef Radar',
    tagline: 'سامانه هوشمند تشخیص مشتریان بالقوه در جوامع آنلاین',
    aiAgentBadge: 'ایجنت هوشمند',
    navOverview: 'نمای کلی',
    navScanner: 'اسکنر رادار',
    navDocs: 'معماری و مستندات',
    navSignIn: 'ورود',
    navGetStarted: 'شروع رایگان',
    navSignOut: 'خروج از حساب',
    navProfile: 'پروفایل کاربری',

    heroEyebrow: 'هوش مصنوعی مستقل شناسایی مشتری بالقوه // ایجنت Alef Radar',
    heroTitle: 'تبدیل مکالمات جوامع آنلاین به پربازده‌ترین کانال فروش',
    heroSubtitle: 'Alef Radar پیام‌های ردیت، تلگرام، توییتر و دیسکورد را رصد کرده، ۷۵٪ چت‌های نامربوط را با هزینه میکروسنت فیلتر می‌کند و در لحظه ابراز نیاز خریدار، پاسخی معتبر و بدون اسپم آماده می‌سازد.',
    launchScannerBtn: 'اجرای رایگان اسکنر Alef Radar',
    docsBtn: 'مشخصات معماری و ایجنت',
    statCostSaved: 'کاهش هزینه توکن و پردازش',
    statStages: 'مراحل خط‌لوله ۴ گانه',
    statLatency: 'میانگین زمان غربالگری',
    statZeroSpam: 'پیشنهاد ارزش‌محور بدون اسپم',
    workflowTitle: 'نحوه کارکرد آبشار ایجنتی Alef Radar',
    workflowSubtitle: 'به جای صرف هزینه‌های سنگین روی تمام پیام‌های چت، Alef Radar پیام‌ها را از یک ماشین حالت ۴ مرحله‌ای فوق کم‌هزینه عبور می‌دهد.',
    step1Title: 'تنظیم پروفایل محصول هدف',
    step1Desc: 'نقاط درد مخاطب، ارزش پیشنهادی، لحن پاسخ و قوانین منفی را برای جلوگیری از هرگونه پیام نامناسب تعریف کنید.',
    step2Title: 'فیلتر هرزنامه و سنجش نیت خرید',
    step2Desc: 'مرحله ۱ پیام‌های نامربوط را با ۰.۰۰۰۰۱ دلار حذف می‌کند. مراحل ۲ و ۳ فوریت خرید و عمق نیاز را سنجیده و امتیاز تطابق ۰ تا ۱۰۰ محاسبه می‌کنند.',
    step3Title: 'تولید پاسخ شخصی‌سازی‌شده',
    step3Desc: 'مرحله ۴ تنها برای سرنخ‌های قطعی فعال شده و راهنمایی تخصصی همراه با معرفی طبیعی محصول شما ارائه می‌دهد.',
    economicTitle: 'چرا بات‌های یکپارچه LLM در ابعاد واقعی شکست می‌خورند؟',
    economicSubtitle: 'ارسال همه پیام‌ها به مدل‌های سنگین موجب هدررفت بودجه روی شوخی‌ها و ربات‌ها می‌شود.',
    manualBrowsing: 'جستجوی دستی انسانی',
    naiveAi: 'هوش مصنوعی تک‌پرامپت ساده',
    radarCascade: 'آبشار چندمرحله‌ای الف رادار',
    pricingTitle: 'طرح‌های اشتراک پیش‌بینی‌پذیر و به‌صرفه',
    pricingSubtitle: 'با طرح رایگان ارزیابی کنید و در صورت نیاز به جریان زنده وب‌هوک ارتقا دهید.',
    planFree: 'طرح رایگان آغازین',
    planPro: 'طرح رشد و کسب‌وکار',
    planEnterprise: 'طرح سازمانی مقیاس‌پذیر',
    faqTitle: 'پرسش‌های متداول',
    ctaTitle: 'همین حالا شناسایی سرنخ‌های باکیفیت را شروع کنید',
    ctaSubtitle: 'حساب رایگان خود را ایجاد کنید یا به عنوان مهمان اسکنر را آزمایش نمایید.',
    ctaBtn: 'ورود به اسکنر رادار',

    workspaceTitle: 'میز کار اسکن و تحلیل رادار',
    workspaceSubtitle: 'معیارهای محصول خود را مشخص کنید، پیام‌های آنلاین را وارد نمایید و مشتریان با پتانسیل بالا را بیابید.',
    backToOverview: 'بازگشت به معرفی محصول',
    targetProfileTitle: 'انتخاب پروفایل محصول هدف',
    targetProfileSubtitle: 'ایجنت پیام‌های ورودی را با این ارزش‌های پیشنهادی و نیازها می‌سنجد.',
    feedTitle: 'ورود داده‌ها و فید گفت‌وگوهای آنلاین',
    feedSubtitle: 'فایل‌های اختصاصی خود (CSV، JSON، متن خام) را آپلود کنید یا از مجموعه‌داده‌های آماده استفاده نمایید.',
    runAgentBtn: 'اجرای ایجنت رادار',
    agentRunning: 'در حال اجرای آبشار ۴ مرحله‌ای...',
    uploadTab: 'بارگذاری فایل CSV / JSON',
    pasteTab: 'چسباندن متن و چت خام',
    benchmarksTab: 'داده‌های بنچمارک آماده',
    addMessageBtn: 'افزودن پیام تکی',
    loadedPosts: 'پیام دریافت شده',
    step2StreamLabel: 'مرحله ۲ // جریان پیام‌های جامعه آنلاین',
    loadBatchBtn: 'بارگذاری بسته ←',
    benchmark01Badge: 'بنچمارک ۰۱ // آموزش و توسعه نرم‌افزار',
    benchmark01Title: 'فید دوره‌های برنامه‌نویسی و تغییر شغل (۸ پیام)',
    benchmark01Desc: 'برگرفته از ردیت r/learnprogramming، گروه‌های تلگرام و دیسکورد؛ افراد گیر افتاده در آموزش‌های تکراری و میم‌های اسپم.',
    benchmark02Badge: 'بنچمارک ۰۲ // سخت‌افزار و ارگونومی',
    benchmark02Title: 'فید عینک بلوکنترل و خستگی چشم مانیتور (۸ پیام)',
    benchmark02Desc: 'مکالمات توییتر و ردیت برنامه‌نویسان و تحلیل‌گرانی که از سوزش چشم و سردرد مانیتور رنج می‌برند.',
    uploadTitle: 'برای بارگذاری کلیک کنید یا فایل داده خود را بکشید و رها کنید',
    uploadDesc: 'پشتیبانی از فرمت‌های CSV، JSON یا TSV خروجی گرفته شده از ردیت، توییتر، تلگرام، دیسکورد یا گوگل شیت.',
    uploadSub: 'تشخیص خودکار ستون‌ها • حداکثر ۵,۰۰۰ سطر',
    sampleTemplateHint: 'ستون‌های پشتیبانی‌شده: text، author، platform، community، timestamp (یا تشخیص خودکار از طول سطر).',
    loadSampleTemplateBtn: 'بارگذاری نمونه قالب CSV',
    pasteLabel: 'چسباندن پیام‌های چندخطی، گزارش چت یا آرایه JSON:',
    pasteSub: 'خطوط متنی یا آبجکت‌های JSON پذیرفته می‌شوند',
    parseIngestBtn: 'تجزیه و ورود پیام‌ها',
    searchBatchPlaceholder: 'جستجو در پیام‌های این بسته...',
    noMessagesLoaded: 'هیچ پیامی در این جریان بارگذاری نشده است.',
    noMessagesSub: 'یک بنچمارک در بالا انتخاب کنید یا فایل داده خود را آپلود نمایید.',
    addModalTitle: 'افزودن پیام تکی',
    addModalDesc: 'یک پیام جامعه آنلاین را وارد کنید تا نحوه برخورد ایجنت با ادبیات خاص آن را بررسی کنید.',
    authorLabel: 'نام کاربری / فرستنده',
    platformLabel: 'پلتفرم',
    communityLabel: 'جامعه / کانال مبدا',
    messageTextLabel: 'متن پیام',
    insertMessageBtn: 'درج پیام در جریان رادار',
    score: 'امتیاز',
    decision: 'تصمیم',
    actNow: 'اقدام فوری',
    watch: 'زیر نظر',
    noise: 'هرزنامه',

    resultsTitle: 'فرصت‌های شناسایی‌شده و پاسخ‌های پیشنهادی',
    resultsSubtitle: 'تحلیل‌شده بر اساس معیارهای محصول با پاسخ‌های ارزش‌محور آماده برای تعامل.',
    copyReplyBtn: 'کپی پاسخ',
    copiedBtn: 'کپی شد!',
    markSentBtn: 'علامت به عنوان ارسال‌شده',
    sentBtn: 'پاسخ ارسال شد',
    exportCsvBtn: 'خروجی CSV',
    exportJsonBtn: 'خروجی JSON',
    highIntentLeads: 'مشتریان با قصد خرید بالا',
    watchNurture: 'مشتریان نیازمند پیگیری',
    noisePruned: 'پیام‌های هرزنامه حذف‌شده',
    costSavedMetric: 'صرفه‌جویی در هزینه توکن',
    whyItWorks: 'دلیل کارایی این پاسخ',

    profileTitle: 'پروفایل کاربری و وضعیت اشتراک',
    profileSubtitle: 'مدیریت مشخصات فردی، سطح اشتراک، سهمیه ماهیانه و کلیدهای توسعه‌دهنده API.',
    displayNameLabel: 'نام نمایشی',
    emailLabel: 'آدرس ایمیل',
    subscriptionTab: 'اشتراک و سهمیه',
    accountTab: 'اطلاعات کاربری',
    apiTab: 'کلید دسترسی API',
    currentPlanLabel: 'سطح اشتراک فعلی',
    monthlyQuotaLabel: 'سهمیه ماهانه پیام‌های اسکن‌شده',
    postsScanned: 'پیام اسکن شده در این ماه',
    upgradeToPro: 'ارتقا به طرح رشد (۴۹ دلار/ماه)',
    downgradeToFree: 'تغییر به طرح رایگان',
    saveChangesBtn: 'ذخیره تغییرات پروفایل',
    savedSuccess: 'تغییرات پروفایل با موفقیت ثبت شد!',
    apiKeyLabel: 'کلید وب‌سرویس اختصاصی (API Key)',
    copyApiKey: 'کپی کلید API',
    themeLabel: 'پوسته ظاهری',
    lightMode: 'روشن (Light)',
    darkMode: 'تاریک (Dark)',
    languageLabel: 'زبان رابط کاربری'
  }
};
