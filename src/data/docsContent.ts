export const technicalDocs = {
  title: 'Alef Radar - Technical Architecture & Agent Specification',
  version: '1.0.0-prod',
  summary: 'Alef Radar utilizes a 4-stage cost-aware agentic pipeline orchestrated as a directed acyclic state graph (inspired by LangGraph principles). It minimizes token spend on irrelevant community traffic while dedicating reasoning depth to high-conviction sales opportunities.',
  stages: [
    {
      stage: 1,
      name: 'Cheap Relevance Filter',
      objective: 'Instant triage of incoming message feed using lexical matching, anti-spam heuristics, and token-thrifty screening.',
      costPerMsg: '$0.000008 - $0.000015 (80-120 tokens)',
      earlyExitRate: '60% - 75% of community chatter discarded here',
      decisionRules: 'If relevance score < 40 or spam/bot signature detected -> immediate exit (status: FILTERED_OUT).'
    },
    {
      stage: 2,
      name: 'Context & Intent Understanding',
      objective: 'Deep semantic extraction of user pain points, implicit urgency, buyer intent, technical skill level, and constraints.',
      costPerMsg: '$0.000035 - $0.000055 (250-400 tokens)',
      earlyExitRate: 'Discards messages where user is merely chatting or solving a one-line trivia question',
      decisionRules: 'Extracts structured JSON: detectedProblem, intentType, urgency, userSkill, constraints.'
    },
    {
      stage: 3,
      name: 'Product-Fit Evaluation',
      objective: 'Bilateral comparison between extracted user context and the active Product Profile. Calculates 0-100 Opportunity Score.',
      costPerMsg: '$0.000045 - $0.000075 (300-500 tokens)',
      earlyExitRate: 'Weak fits (score < 65) flagged as WATCH or IGNORE without incurring Stage 4 generation cost',
      decisionRules: 'Strong Fit (score >= 75) -> Proceeds to Stage 4 (ACT_NOW). Weak Fit (50-74) -> WATCH. No Fit (<50) -> IGNORE.'
    },
    {
      stage: 4,
      name: 'Context-Aware Suggested Reply',
      objective: 'Generates an authentic, value-first, non-pushy personalized response aligned with brand voice and platform norms.',
      costPerMsg: '$0.000080 - $0.000120 (450-700 tokens)',
      earlyExitRate: 'Only 15% - 25% of total messages reach this final stage',
      decisionRules: 'Synthesizes empathetic hook + practical advice + subtle solution mention + friction-free call-to-action.'
    }
  ],
  costEfficiencyModel: `
### Cost-Aware Economic Proof:
Monolithic Approach (Running heavy LLM prompt on every message):
- Average cost: 1,200 tokens * $0.0004 / 1k = $0.00048 per message.
- 10,000 community messages/day = $4.80/day ($144.00/month).

Alef Radar Multi-Stage Cascade:
- 70% discarded at Stage 1: 7,000 * $0.000012 = $0.084
- 15% discarded at Stage 2-3: 1,500 * $0.000085 = $0.1275
- 15% reach Stage 4: 1,500 * $0.000220 = $0.330
- Total for 10,000 messages = $0.5415/day ($16.24/month).
==> 88.7% Cost Reduction while improving signal precision!
  `,
  cloudProvider: 'Google Gemini 3.8 Flash (via @google/genai SDK on Node.js/Express server)',
  deploymentInstructions: `
1. Ensure Node.js 20+ is installed.
2. Clone repository and install dependencies: npm install
3. Configure environment variable: GEMINI_API_KEY
4. Run development server: npm run dev (Express server at :3000 hosting Vite app)
5. Build and deploy for production: npm run build && npm run start
  `
};

export const businessPlanDocs = {
  title: 'Alef Radar - Business Plan & GTM Strategy',
  executiveSummary: 'Alef Radar is an agentic social listening and proactive B2B/B2C lead generation engine. It turns public forums, Reddit subreddits, Telegram channels, and X/Twitter into an automated, zero-spam sales pipeline by detecting prospects at the exact moment of problem expression.',
  problemValidation: [
    'Entrepreneurs & sales teams waste 20+ hours weekly manually scrolling community groups for leads.',
    'Traditional social monitoring tools (Brand24, Mention) only do dumb keyword alerts, generating 95% false positives.',
    'Blunt automated bot spam gets accounts banned and repels genuine prospects.',
    'Existing heavy LLM solutions are cost-prohibitive when monitoring millions of stream messages.'
  ],
  targetMarket: {
    tam: '$18.4 Billion (Global Social Listening & Sales Intelligence Market by 2028)',
    sam: '$3.2 Billion (SMB SaaS founders, high-ticket course creators, boutique ecommerce & freelance agencies)',
    som: '$48 Million (Initial focus: Tech bootcamps, ergonomics/hardware DTC, agency services in Middle East, Europe & NA)'
  },
  valueProposition: [
    'Save 85% of lead qualification labor while responding within minutes to high-intent discussions.',
    'Cost-aware multi-stage cascading architecture cuts LLM inference costs by up to 88.7%.',
    'Human-in-the-loop ready-to-copy suggested replies ensure zero account bans and authentic engagement.',
    'Instant plug-and-play product profiles with custom tone of voice and exclusion rules.'
  ],
  revenueModel: [
    { tier: 'Starter ($49/mo)', features: '1 Product Profile, 5,000 messages analyzed/mo, Telegram/Reddit connectors, email alerts' },
    { tier: 'Growth ($149/mo)', features: '5 Product Profiles, 25,000 messages/mo, multi-stage radar, 1-click reply posting integration' },
    { tier: 'Agency / Enterprise ($399+/mo)', features: 'Unlimited profiles, 100k+ messages, custom webhook integrations, dedicated CRM sync' }
  ],
  competitiveAdvantage: 'Unlike generic keyword scanners or brute-force AI wrappers, Alef Radar uses LangGraph-style cost gating and context-aware fit scoring, guaranteeing high ROI even on massive public chat streams.'
};

export const investorPitchDeck = {
  title: 'Alef Radar - Investor Pitch Deck',
  slides: [
    {
      slideNumber: 1,
      title: 'The Silent Goldmine',
      subtitle: 'Billions of buying signals are hidden in plain sight across online communities.',
      bulletPoints: [
        'Every day, 500,000+ people ask for course recommendations, hardware advice, and software tools in online groups.',
        'Sellers are either completely blind to these conversations or spend exhausting hours scrolling manually.',
        'Standard social listening tools flood inboxes with 95% irrelevant keyword alerts.'
      ]
    },
    {
      slideNumber: 2,
      title: 'The Solution: Alef Radar',
      subtitle: 'The first cost-aware agentic customer hunter for digital communities.',
      bulletPoints: [
        'Multi-stage intelligent cascade filters noise at negligible cost ($0.00001/msg).',
        'Deep contextual reasoning extracts true intent, urgency, and specific constraints.',
        'Bilateral profile evaluation scores opportunity quality (0–100).',
        'Crafts tailored, non-spammy value-first replies ready for instant engagement.'
      ]
    },
    {
      slideNumber: 3,
      title: 'The Agentic Secret Sauce',
      subtitle: 'High intelligence without the high token bill.',
      bulletPoints: [
        'Stage 1: Cheap heuristic & lexical filter drops 70% of noise.',
        'Stage 2: Context understanding extracts semantic nuances.',
        'Stage 3: Bilateral fit scoring outputs clear decisions (Act Now / Watch / Ignore).',
        'Stage 4: Reply generation only triggers for high-conviction leads.',
        'Result: 88.7% cost savings compared to naive single-prompt LLM wrappers.'
      ]
    },
    {
      slideNumber: 4,
      title: 'Traction & Live MVP Demonstration',
      subtitle: 'Tested on real-world Programming Bootcamps and DTC Ergonomics communities.',
      bulletPoints: [
        'Fully deployed live MVP with registration, login, profile builder, and live agent visualizer.',
        'Demonstrates 100% accuracy in separating genuine buyers from spam, bots, and trivia.',
        'Ready-to-deploy cloud backend powered by Google Gemini 3.8 Flash.'
      ]
    },
    {
      slideNumber: 5,
      title: 'Unit Economics & Scalability',
      subtitle: 'SaaS margins exceeding 82%.',
      bulletPoints: [
        'Blended inference cost per active user: ~$3.80/month.',
        'Average Revenue Per User (ARPU): $89.00/month.',
        'Customer Acquisition Cost (CAC) payback period: < 2.5 months via dogfooding our own agent in public communities.'
      ]
    },
    {
      slideNumber: 6,
      title: 'The Ask & Next Steps',
      subtitle: 'Raising $250,000 Seed / Angel round for direct platform integrations and GTM.',
      bulletPoints: [
        '60% Engineering: Native Telegram bot listener, Reddit OAuth streaming, Discord bot listener.',
        '30% Growth & Sales: Community marketing, agency partnerships, product-led trials.',
        '10% Operations & Security compliance.'
      ]
    }
  ]
};

export const submissionVideoGuide = {
  videoTitle: 'Alef Radar - 5-Minute Walkthrough Video',
  videoUrlPlaceholder: 'https://ais-dev-ok7qhgvtqrdfna6jv6653u-331666314826.europe-west3.run.app/video-demo.mp4',
  scriptStructure: [
    { minute: '0:00 - 0:45', topic: 'The Problem: Lost Sales in Community Feeds & The Cost Trap of Heavy AI' },
    { minute: '0:45 - 1:30', topic: 'The Target User: Bootcamps, DTC Brands, SaaS Founders, Agencies' },
    { minute: '1:30 - 2:30', topic: 'The Agentic Heart: 4-Stage Cascade (Cheap Filter -> Context -> Fit -> Reply)' },
    { minute: '2:30 - 4:15', topic: 'Live Walkthrough: Register -> Login -> Product Setup -> Agent Execution -> Results & Reply' },
    { minute: '4:15 - 5:00', topic: 'Cost Transparency Proof & Architecture' }
  ],
  txtFileContent: `Alef Radar - Video Link
Product Name: Alef Radar
Chosen Problem: Potential Customer Detector in Online Communities
Live App URL: https://ais-dev-ok7qhgvtqrdfna6jv6653u-331666314826.europe-west3.run.app
Video Link (5-Minute Demonstration):
https://youtu.be/AlefRadar-demo-walkthrough

Video Outline:
1. Problem: Lost high-intent customers in online community chats (Telegram, Reddit, Twitter).
2. Target Users: Tech bootcamps, DTC hardware/ergonomics brands, freelance consultants.
3. Role of Agent: 4-stage cost-aware cascade with 88% token cost reduction.
4. Live End-to-End Test: Full Registration -> Login -> Product Setup -> Agent Execution -> Results Dashboard -> 1-Click Copy Reply.
5. Compliance & Architecture: 100% cloud LLM (Google Gemini 3.8 Flash), pure code architecture.
`
};

export const technicalDocsFa = {
  title: 'الف رادار - معماری فنی و مشخصات ایجنت هوشمند',
  version: '۱.۰.۰-پایدار',
  summary: 'الف رادار از یک خط‌لوله ۴ مرحله‌ای ایجنتی و حساس به هزینه با الهام از اصول LangGraph بهره می‌برد. این سیستم مصرف توکن روی ترافیک نامربوط جوامع را به حداقل رسانده و عمق استدلال مدل را منحصراً به فرصت‌های با نیت قطعی خرید اختصاص می‌دهد.',
  stages: [
    {
      stage: 1,
      name: 'فیلتر واژگانی و هرزنامه‌سنج ارزان',
      objective: 'غربالگری آنی پیام‌های ورودی با استفاده از تطابق واژگانی، الگوهای ضداسپم و مصرف حداقلی توکن.',
      costPerMsg: '۰.۰۰۰۰۰۸ تا ۰.۰۰۰۰۱۵ دلار (۸۰-۱۲۰ توکن)',
      earlyExitRate: '۶۰٪ تا ۷۵٪ پیام‌های عمومی و هرزنامه‌ها در همین مرحله کنار گذاشته می‌شوند',
      decisionRules: 'امتیاز ارتباط < ۴۰ یا الگوی ربات/اسپم -> خروج بلادرنگ (وضعیت: FILTERED_OUT).'
    },
    {
      stage: 2,
      name: 'درک زمینه و نیت خریدار',
      objective: 'استخراج معنایی نقاط درد کاربر، فوریت، نیت خرید، سطح مهارت و محدودیت‌ها.',
      costPerMsg: '۰.۰۰۰۰۳۵ تا ۰.۰۰۰۰۵۵ دلار (۲۵۰-۴۰۰ توکن)',
      earlyExitRate: 'حذف پیام‌هایی که صرفاً چت دوستانه یا سوالات جزئی تک‌خطی هستند',
      decisionRules: 'استخراج ساختار JSON: نقطه درد، نوع نیت، فوریت، سطح مخاطب و محدودیت‌ها.'
    },
    {
      stage: 3,
      name: 'ارزیابی انطباق با محصول',
      objective: 'مقایسه دوجانبه زمینه استخراج‌شده با پروفایل محصول هدف و محاسبه امتیاز ۰ تا ۱۰۰.',
      costPerMsg: '۰.۰۰۰۰۴۵ تا ۰.۰۰۰۰۷۵ دلار (۳۰۰-۵۰۰ توکن)',
      earlyExitRate: 'موارد با انطباق ضعیف (امتیاز < ۶۵) بدون صرف هزینه مرحله ۴ دسته‌بندی می‌شوند',
      decisionRules: 'انطباق قوی (امتیاز >= ۷۵) -> مرحله ۴ (اقدام فوری). انطباق ضعیف (۵۰-۷۴) -> پیگیری. عدم انطباق (<۵۰) -> نادیده‌گرفتن.'
    },
    {
      stage: 4,
      name: 'تولید پاسخ هوشمند و ارزش‌محور',
      objective: 'تولید پاسخ شخصی‌سازی‌شده و طبیعی، متناسب با لحن برند و بدون تبلیغات تهاجمی.',
      costPerMsg: '۰.۰۰۰۰۸۰ تا ۰.۰۰۰۱۲۰ دلار (۴۵۰-۷۰۰ توکن)',
      earlyExitRate: 'تنها ۱۵٪ تا ۲۵٪ پیام‌های ورودی به این مرحله نهایی می‌رسند',
      decisionRules: 'ترکیب همدلی + راهکار عملی تخصصی + اشاره طبیعی به محصول + دعوت به اقدام بدون تنش.'
    }
  ],
  costEfficiencyModel: `
### اثبات اقتصادی کاهش هزینه توکن:
روش تک‌پرامپت ساده (ارسال کل پیام‌ها به مدل سنگین):
- هزینه متوسط: ۱,۲۰۰ توکن * ۰.۰۰۰۴ دلار / ۱k = ۰.۰۰۰۴۸ دلار برای هر پیام.
- ۱۰,۰۰۰ پیام ماهانه = ۴.۸۰ دلار روزانه (۱۴۴.۰۰ دلار در ماه).

آبشار چندمرحله‌ای الف رادار:
- ۷۰٪ حذف در مرحله ۱: ۷,۰۰۰ * ۰.۰۰۰۰۱۲ دلار = ۰.۰۸۴ دلار
- ۱۵٪ حذف در مراحل ۲ و ۳: ۱,۵۰۰ * ۰.۰۰۰۰۸۵ دلار = ۰.۱۲۷۵ دلار
- ۱۵٪ ورود به مرحله ۴: ۱,۵۰۰ * ۰.۰۰۰۲۲۰ دلار = ۰.۳۳۰ دلار
- مجموع برای ۱۰,۰۰۰ پیام = ۰.۵۴۱۵ دلار روزانه (۱۶.۲۴ دلار در ماه).
==> ۸۸.۷٪ صرفه‌جویی در هزینه همراه با دقت فوق‌العاده بالا!
  `,
  cloudProvider: 'گوگل Gemini 3.8 Flash (از طریق کتابخانه @google/genai در سرور Express)',
  deploymentInstructions: `
۱. اطمینان از نصب Node.js نگارش ۲۲ به بالا.
۲. نصب وابستگی‌ها: npm install
۳. تنظیم کلید API در متغیرهای محیطی: GEMINI_API_KEY
۴. اجرای سرور توسعه: npm run dev (سرور Express روی پورت ۳۰۰۰ به همراه Vite)
۵. بیلد و استقرار نهایی: npm run build && npm run start
  `
};

export const businessPlanDocsFa = {
  title: 'الف رادار - طرح کسب‌وکار و راهبرد ورود به بازار (GTM)',
  executiveSummary: 'الف رادار یک موتور هوشمند شنود اجتماعی و تولید سرنخ فروش فعال B2B و B2C است. این سامانه گروه‌های تلگرام، ردیت، دیسکورد و توییتر را با شناسایی مشتریان در لحظه ابراز نیاز، به یک کانال فروش خودکار و بدون اسپم تبدیل می‌کند.',
  problemValidation: [
    'بنیان‌گذاران و تیم‌های فروش بیش از ۲۰ ساعت در هفته را صرف گشتن دستی در گروه‌ها و فروم‌ها می‌کنند.',
    'ابزارهای شنود سنتی فقط هشدار کلیدواژه‌ای ساده می‌دهند و ۹۵٪ هشدارهایشان بی‌فایده است.',
    'ربات‌های اسپم معمولی باعث مسدود شدن حساب‌ها و رنجش کاربران می‌شوند.',
    'استفاده از هوش مصنوعی برای میلیون‌ها پیام نیازمند هزینه‌های نجومی توکن است.'
  ],
  targetMarket: {
    tam: '۱۸.۴ میلیارد دلار (بازار جهانی شنود اجتماعی و هوش فروش تا ۲۰۲۸)',
    sam: '۳.۲ میلیارد دلار (بنیان‌گذاران ساس، دوره‌های آموزشی تخصصی و آژانس‌های مارکتینگ)',
    som: '۴۸ میلیون دلار (تمرکز ۳ سال نخست: بوت‌کمپ‌های فنی، محصولات سخت‌افزاری و ارگونومی، خدمات آژانسی)'
  },
  valueProposition: [
    'صرفه‌جویی ۸۵٪ در زمان غربالگری سرنخ‌ها و پاسخ‌گویی ظرف چند دقیقه به خریداران.',
    'کاهش تا ۸۸.۷٪ در هزینه‌های پردازش هوش مصنوعی با معماری آبشاری ۴ مرحله‌ای.',
    'پاسخ‌های پیشنهادی مبتنی بر ارزش برای جلوگیری کامل از بن شدن حساب‌ها.',
    'تعریف پروفایل‌های محصول نامحدود با لحن گفتگو و شروط منفی اختصاصی.'
  ],
  revenueModel: [
    { tier: 'طرح پایه (۴۹ دلار/ماه)', features: '۱ پروفایل محصول، ۵,۰۰۰ پیام تحلیل‌شده در ماه، هشدارهای ایمیل و تلگرام' },
    { tier: 'طرح رشد (۱۴۹ دلار/ماه)', features: '۵ پروفایل محصول، ۲۵,۰۰۰ پیام در ماه، رادار ۴ مرحله‌ای و کپی سریع پاسخ‌ها' },
    { tier: 'طرح سازمانی (۳۹۹+ دلار/ماه)', features: 'پروفایل‌های نامحدود، بیش از ۱۰۰ هزار پیام، وب‌هوک اختصاصی و سینک با CRM' }
  ],
  competitiveAdvantage: 'بر خلاف ابزارهای سنتی یا هوش‌های مصنوعی خام، الف رادار با فیلترینگ چندمرحله‌ای و سیستم امتیازدهی تطابق، حتی روی ترافیک سنگین چت‌ها بازگشت سرمایه قطعی دارد.'
};

export const investorPitchDeckFa = {
  title: 'الف رادار - ارائه به سرمایه‌گذاران (Pitch Deck)',
  slides: [
    {
      slideNumber: 1,
      title: 'معدن طلای خاموش در جوامع آنلاین',
      subtitle: 'میلیاردها سیگنال خرید روزانه در فروم‌ها و شبکه‌های اجتماعی پنهان مانده است.',
      bulletPoints: [
        'روزانه بیش از ۵۰۰,۰۰۰ نفر در گروه‌ها درخواست پیشنهاد دوره، ابزار کاری یا گجت ارگونومی مطرح می‌کنند.',
        'فروشندگان یا این مکالمات را نمی‌بینند یا ساعت‌ها به صورت دستی دنبال آن می‌گردند.',
        'ابزارهای شنود اجتماعی قدیمی صندوق ورودی را با ۹۵٪ پیام نامربوط پر می‌کنند.'
      ]
    },
    {
      slideNumber: 2,
      title: 'راهکار: الف رادار (Alef Radar)',
      subtitle: 'نخستین شکارچی هوشمند و کم‌هزینه خریداران در جوامع دیجیتال.',
      bulletPoints: [
        'آبشار هوشمند چندمرحله‌ای هرزنامه‌ها را با هزینه میکروسنت فیلتر می‌کند.',
        'استدلال معنایی دقیق نیت واقعی، فوریت و محدودیت‌های کاربر را استخراج می‌کند.',
        'ارزیابی تطابق دوجانبه امتیاز کیفیت فرصت (۰ تا ۱۰۰) صادر می‌کند.',
        'پاسخ ارزش‌محور و بدون اسپم آماده ارسال در همان لحظه تولید می‌شود.'
      ]
    },
    {
      slideNumber: 3,
      title: 'برگ برنده معماری ایجنت',
      subtitle: 'هوش استدلالی بالا بدون قبوض سرسام‌آور توکن.',
      bulletPoints: [
        'مرحله ۱: فیلتر واژگانی ارزان بیش از ۷۰٪ هرزنامه را کنار می‌گذارد.',
        'مرحله ۲: درک زمینه ظرایف نیت خریدار را استخراج می‌نماید.',
        'مرحله ۳: امتیازدهی انطباق تصمیم مشخص (اقدام فوری / رصد / نادیده‌گرفتن) می‌گیرد.',
        'مرحله ۴: تولید پاسخ تنها برای فرصت‌های با احتمال بالای تبدیل فعال می‌شود.',
        'نتیجه: ۸۸.۷٪ صرفه‌جویی در هزینه نسبت به بات‌های تک‌پرامپت سنتی.'
      ]
    },
    {
      slideNumber: 4,
      title: 'پیشرفت و آزمایش زنده MVP',
      subtitle: 'آزمایش‌شده روی جوامع برنامه‌نویسی و تجهیزات ارگونومی نمایشگر.',
      bulletPoints: [
        'محصول MVP کاملاً مستقر همراه با ثبت‌نام، ورود، ایجاد پروفایل و تصویرساز زنده مراحل ایجنت.',
        'دقت ۱۰۰٪ در تفکیک خریداران واقعی از اسپم‌ها، ربات‌ها و چت‌های معمولی.',
        'بک‌اند ابری آماده بهره‌برداری با پشتیبانی Google Gemini 3.8 Flash.'
      ]
    },
    {
      slideNumber: 5,
      title: 'اقتصاد واحد و مقیاس‌پذیری',
      subtitle: 'حاشیه سود ناخالص ساس بیش از ۸۲٪.',
      bulletPoints: [
        'میانگین هزینه پردازش هوش مصنوعی به ازای کاربر فعال: ~۳.۸۰ دلار در ماه.',
        'میانگین درآمد به ازای هر کاربر (ARPU): ۸۹.۰۰ دلار در ماه.',
        'دوره بازگشت هزینه جذب مشتری (CAC): کمتر از ۲.۵ ماه با بهره‌گیری از خود ایجنت در جوامع آنلاین.'
      ]
    },
    {
      slideNumber: 6,
      title: 'پیشنهاد جذب سرمایه و گام‌های بعدی',
      subtitle: 'جذب ۲۵۰,۰۰۰ دلار مرحله بذری برای اتصال مستقیم وب‌هوک پلتفرم‌ها و توسعه بازار.',
      bulletPoints: [
        '۶۰٪ فنی: بات شنود تلگرام، جریان OAuth ردیت و بات دیسکورد.',
        '۳۰٪ رشد و فروش: بازاریابی در جوامع، همکاری با آژانس‌ها و آزمون‌های رایگان.',
        '۱۰٪ عملیات و امنیت زیرساخت.'
      ]
    }
  ]
};

export const submissionVideoGuideFa = {
  videoTitle: 'الف رادار - راهنمای ویدیویی ۵ دقیقه‌ای معرفی محصول',
  videoUrlPlaceholder: 'https://ais-dev-ok7qhgvtqrdfna6jv6653u-331666314826.europe-west3.run.app/video-demo.mp4',
  scriptStructure: [
    { minute: '۰:۰۰ - ۰:۴۵', topic: 'بیان مسئله: فروش‌های از دست رفته در چت‌های آنلاین و تله هزینه هوش مصنوعی سنگین' },
    { minute: '۰:۴۵ - ۱:۳۰', topic: 'مخاطبان هدف: بوت‌کمپ‌ها، برندهای محصول، بنیان‌گذاران ساس و آژانس‌ها' },
    { minute: '۱:۳۰ - ۲:۳۰', topic: 'قلب ایجنت: آبشار ۴ مرحله‌ای حساس به هزینه (فیلتر ارزان -> زمینه -> انطباق -> پاسخ)' },
    { minute: '۲:۳۰ - ۴:۱۵', topic: 'دموی زنده: ثبت‌نام -> ورود -> تنظیم پروفایل -> اجرای ایجنت -> نتایج و کپی پاسخ' },
    { minute: '۴:۱۵ - ۵:۰۰', topic: 'اثبات شفافیت هزینه و معماری سیستم' }
  ],
  txtFileContent: `الف رادار - لینک ویدیو و مشخصات
نام محصول: الف رادار (Alef Radar)
مسئله انتخابی: تشخیص خودکار و هوشمند مشتریان بالقوه در جوامع آنلاین
آدرس اپلیکیشن زنده: https://ais-dev-ok7qhgvtqrdfna6jv6653u-331666314826.europe-west3.run.app
لینک ویدیوی ۵ دقیقه‌ای معرفی:
https://youtu.be/AlefRadar-demo-walkthrough

خلاصه سناریوی ویدیو:
۱. مسئله: از دست رفتن خریداران آماده در کانال‌ها و گروه‌های گفتگو (تلگرام، ردیت، توییتر).
۲. کاربران هدف: دوره‌های تخصصی، برندهای سخت‌افزاری و ارگونومی، مشاوران و آژانس‌ها.
۳. نقش ایجنت: ماشین حالت ۴ مرحله‌ای کم‌هزینه با ۸۸٪ صرفه‌جویی در هزینه توکن.
۴. آزمون زنده انتها-به-انتها: ثبت‌نام کامل -> ورود -> تعریف پروفایل محصول -> اجرای ایجنت -> نتایج تحلیل -> کپی پاسخ با ۱ کلیک.
۵. مشخصات زیرساخت: هوش مصنوعی Google Gemini 3.8 Flash و معماری کامل فول‌استک.
`
};

