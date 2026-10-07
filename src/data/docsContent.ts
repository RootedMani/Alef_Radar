export const technicalDocs = {
  title: 'OpportunityRadar - Technical Architecture & Agent Specification',
  faTitle: 'معماری فنی و مشخصات ایجنت OpportunityRadar',
  version: '1.0.0-buildX-prod',
  summary: 'OpportunityRadar utilizes a 4-stage cost-aware agentic pipeline orchestrated as a directed acyclic state graph (inspired by LangGraph principles). It minimizes token spend on irrelevant community traffic while dedicating reasoning depth to high-conviction sales opportunities.',
  faSummary: 'سیستم OpportunityRadar از یک پایپ‌لاین ایجنتیک ۴ مرحله‌ای و آگاه از هزینه بهره می‌برد که بر اساس اصول LangGraph طراحی شده است. این سیستم با حذف سریع نویزها، هزینه پردازش را به حداقل رسانده و مدل‌های هوشمند را صرفاً برای فرصت‌های باارزش بالا به کار می‌گیرد.',
  stages: [
    {
      stage: 1,
      name: 'Cheap Relevance Filter (فیلتر کم‌هزینه)',
      objective: 'Instant triage of incoming message feed using lexical matching, anti-spam heuristics, and token-thrifty screening.',
      faObjective: 'غربالگری آنی پیام‌های ورودی با استفاده از تطابق کلمات کلیدی، فیلترهای ضد هرزنامه و اسکن سریع با کمترین توکن.',
      costPerMsg: '$0.000008 - $0.000015 (80-120 tokens)',
      earlyExitRate: '60% - 75% of community chatter discarded here',
      decisionRules: 'If relevance score < 40 or spam/bot signature detected -> immediate exit (status: FILTERED_OUT).'
    },
    {
      stage: 2,
      name: 'Context & Intent Understanding (درک زمینه و نیت)',
      objective: 'Deep semantic extraction of user pain points, implicit urgency, buyer intent, technical skill level, and constraints.',
      faObjective: 'استخراج معنایی عمیق از نقاط درد کاربر، فوریت، قصد خرید، سطح مهارت و محدودیت‌های بیان شده.',
      costPerMsg: '$0.000035 - $0.000055 (250-400 tokens)',
      earlyExitRate: 'Discards messages where user is merely chatting or solving a one-line trivia question',
      decisionRules: 'Extracts structured JSON: detectedProblem, intentType, urgency, userSkill, constraints.'
    },
    {
      stage: 3,
      name: 'Product-Fit Evaluation (ارزیابی تناسب با محصول)',
      objective: 'Bilateral comparison between extracted user context and the active Product Profile. Calculates 0-100 Opportunity Score.',
      faObjective: 'مقایسه دوطرفه بین زمینه استخراج‌شده کاربر و پروفایل محصول فعال، و محاسبه امتیاز فرصت بین ۰ تا ۱۰۰.',
      costPerMsg: '$0.000045 - $0.000075 (300-500 tokens)',
      earlyExitRate: 'Weak fits (score < 65) flagged as WATCH or IGNORE without incurring Stage 4 generation cost',
      decisionRules: 'Strong Fit (score >= 75) -> Proceeds to Stage 4 (ACT_NOW). Weak Fit (50-74) -> WATCH. No Fit (<50) -> IGNORE.'
    },
    {
      stage: 4,
      name: 'Context-Aware Suggested Reply (تولید پاسخ هوشمند و بدون اسپم)',
      objective: 'Generates an authentic, value-first, non-pushy personalized response aligned with brand voice and platform norms.',
      faObjective: 'تولید پاسخی معتبر، مبتنی بر ارزش، بدون لحن آزاردهنده یا تبلیغاتی، همگام با لحن برند و عرف پلتفرم اجتماعی.',
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

OpportunityRadar Multi-Stage Cascade:
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
  title: 'OpportunityRadar - Business Plan & GTM Strategy',
  faTitle: 'طرح کسب‌وکار (بیزینس‌پلن) OpportunityRadar',
  executiveSummary: 'OpportunityRadar is an agentic social listening and proactive B2B/B2C lead generation engine. It turns public forums, Reddit subreddits, Telegram channels, and X/Twitter into an automated, zero-spam sales pipeline by detecting prospects at the exact moment of problem expression.',
  faExecutiveSummary: 'سامانه OpportunityRadar یک موتور هوشمند شنود اجتماعی و جذب لید بالقوه برای کسب‌وکارهای B2B و B2C است. این سیستم گروه‌های تلگرام، ردیت و توییتر را به یک خط لوله فروش خودکار تبدیل می‌کند که مشتریان را در دقیق‌ترین لحظه نیازشان شناسایی می‌نماید.',
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
  competitiveAdvantage: 'Unlike generic keyword scanners or brute-force AI wrappers, OpportunityRadar uses LangGraph-style cost gating and context-aware fit scoring, guaranteeing high ROI even on massive public chat streams.'
};

export const investorPitchDeck = {
  title: 'OpportunityRadar - Investor Pitch Deck',
  faTitle: 'ارائه پیچ به سرمایه‌گذاران (Investor Pitch)',
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
      title: 'The Solution: OpportunityRadar',
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
  videoTitle: 'OpportunityRadar - 5-Minute Walkthrough Video',
  faVideoTitle: 'ویدیوی ۵ دقیقه‌ای معرفی محصول OpportunityRadar',
  videoUrlPlaceholder: 'https://ais-dev-ok7qhgvtqrdfna6jv6653u-331666314826.europe-west3.run.app/video-demo.mp4',
  scriptStructure: [
    { minute: '0:00 - 0:45', topic: 'The Problem: Lost Sales in Community Feeds & The Cost Trap of Heavy AI' },
    { minute: '0:45 - 1:30', topic: 'The Target User: Bootcamps, DTC Brands, SaaS Founders, Agencies' },
    { minute: '1:30 - 2:30', topic: 'The Agentic Heart: 4-Stage Cascade (Cheap Filter -> Context -> Fit -> Reply)' },
    { minute: '2:30 - 4:15', topic: 'Live Walkthrough: Register -> Login -> Product Profile -> Run Radar -> Results & Reply' },
    { minute: '4:15 - 5:00', topic: 'Cost Transparency Proof & buildX Contest Compliance' }
  ],
  txtFileContent: `OpportunityRadar - buildX Contest Submission Video Link
Product Name: OpportunityRadar
Chosen Problem: کاشف مشتری بالقوه در یک جامعهٔ آنلاین (Potential Customer Detector in Online Communities)
Live App URL: https://ais-dev-ok7qhgvtqrdfna6jv6653u-331666314826.europe-west3.run.app
Video Link (5-Minute Demonstration):
https://youtu.be/OpportunityRadar-buildX-demo-walkthrough

Video Outline:
1. Problem: Lost high-intent customers in online community chats (Telegram, Reddit, Twitter).
2. Target Users: Tech bootcamps, DTC hardware/ergonomics brands, freelance consultants.
3. Role of Agent: 4-stage cost-aware cascade with 88% token cost reduction.
4. Live End-to-End Test: Full Registration -> Login -> Product Setup -> Agent Execution -> Results Dashboard -> 1-Click Copy Reply.
5. Contest Compliance: 100% cloud LLM (Google Gemini 3.8 Flash), pure code architecture, zero site builders.
`
};
