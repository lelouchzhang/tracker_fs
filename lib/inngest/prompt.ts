export const PERSONALIZED_WELCOME_EMAIL_PROMPT = `生成高度个性化的HTML内容，将插入到邮件模板的{{intro}}占位符中。
为避免歧义，prompt使用英文说明，但你的输出内容应尽量使用中文。

User profile data:
{{userProfile}}

PERSONALIZATION REQUIREMENTS:
You MUST create content that is obviously tailored to THIS specific user by:

IMPORTANT: Do NOT start the personalized content with "Welcome" since the email header already says "Welcome aboard {{name}}". Use alternative openings like "Thanks for joining", "Great to have you", "You're all set", "Perfect timing", etc.

1. **Direct Reference to User Details**: Extract and use specific information from their profile:
   - Their exact investment goals or objectives
   - Their stated risk tolerance level
   - Their preferred sectors/industries mentioned
   - Their experience level or background
   - Any specific stocks/companies they're interested in
   - Their investment timeline (short-term, long-term, retirement)

2. **Contextual Messaging**: Create content that shows you understand their situation:
   - New investors → Reference learning/starting their journey
   - Experienced traders → Reference advanced tools/strategy enhancement  
   - Retirement planning → Reference building wealth over time
   - Specific sectors → Reference those exact industries by name
   - Conservative approach → Reference safety and informed decisions
   - Aggressive approach → Reference opportunities and growth potential

3. **Personal Touch**: Make it feel like it was written specifically for them:
   - Use their goals in your messaging
   - Reference their interests directly
   - Connect features to their specific needs
   - Make them feel understood and seen

CRITICAL FORMATTING REQUIREMENTS:
- Return ONLY clean HTML content with NO markdown, NO code blocks, NO backticks
- Use SINGLE paragraph only: <p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">content</p>
- Write exactly TWO sentences (add one more sentence than current single sentence)
- Keep total content between 35-50 words for readability
- Use <strong> for key personalized elements (their goals, sectors, etc.)
- DO NOT include "Here's what you can do right now:" as this is already in the template
- Make every word count toward personalization
- Second sentence should add helpful context or reinforce the personalization

Example personalized outputs (showing obvious customization with TWO sentences):
<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">感谢加入Signalist！作为专注于<strong>科技成长股</strong>的投资者，您会喜欢我们为您跟踪的公司提供的实时提醒。我们将帮助您在机会成为主流新闻之前发现它们。</p>

<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">很高兴有您加入！非常适合您的<strong>保守退休策略</strong>——我们将帮助您监控股息股票，而不会让您被噪音淹没。您终于可以自信清晰地跟踪投资组合进展。</p>

<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">您已准备就绪！既然您是投资新手，我们设计了简单工具帮助您在学习感兴趣的<strong>医疗健康板块</strong>时建立信心。我们新手友好的提醒将指导您，没有令人困惑的行话。</p>`;

export const NEWS_SUMMARY_EMAIL_PROMPT = `为市场新闻摘要邮件生成HTML内容，将插入到NEWS_SUMMARY_EMAIL_TEMPLATE的{{newsContent}}占位符中。
为避免歧义，prompt使用英文说明，但你的输出内容应尽量使用中文。

News data to summarize:
{{newsData}}

CRITICAL FORMATTING REQUIREMENTS:
- Return ONLY clean HTML content with NO markdown, NO code blocks, NO backticks
- Structure content with clear sections using proper HTML headings and paragraphs
- Use these specific CSS classes and styles to match the email template:

SECTION HEADINGS (for categories like "Market Highlights", "Top Movers", etc.):
<h3 class="mobile-news-title dark-text" style="margin: 30px 0 15px 0; font-size: 18px; font-weight: 600; color: #f8f9fa; line-height: 1.3;">部分标题</h3>

PARAGRAPHS (for news content):
<p class="mobile-text dark-text-secondary" style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">内容在此</p>

STOCK/COMPANY MENTIONS:
<strong style="color: #FDD458;">Stock Symbol</strong> for ticker symbols
<strong style="color: #CCDADC;">Company Name</strong> for company names

PERFORMANCE INDICATORS:
Use 📈 for gains, 📉 for losses, 📊 for neutral/mixed

NEWS ARTICLE STRUCTURE:
For each individual news item within a section, use this structure:
1. Article container with visual styling and icon
2. Article title as a subheading
3. Key takeaways in bullet points (2-3 actionable insights)
4. "What this means" section for context
5. "Read more" link to the original article
6. Visual divider between articles

ARTICLE CONTAINER:
Wrap each article in a clean, simple container:
<div class="dark-info-box" style="background-color: #212328; padding: 24px; margin: 20px 0; border-radius: 8px;">

ARTICLE TITLES:
<h4 class="dark-text" style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #FFFFFF; line-height: 1.4;">
Article Title Here
</h4>

BULLET POINTS (minimum 3 concise insights):
Use this format with clear, concise explanations (no label needed):
<ul style="margin: 16px 0 20px 0; padding-left: 0; margin-left: 0; list-style: none;">
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>Clear, concise explanation in simple terms that's easy to understand quickly.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>Brief explanation with key numbers and what they mean in everyday language.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>Simple takeaway about what this means for regular people's money.
  </li>
</ul>

INSIGHT SECTION:
Add simple context explanation:
<div style="background-color: #141414; border: 1px solid #374151; padding: 15px; border-radius: 6px; margin: 16px 0;">
<p class="dark-text-secondary" style="margin: 0; font-size: 14px; color: #CCDADC; line-height: 1.4;">💡 <strong style="color: #FDD458;">核心要点：</strong> 用日常语言简单解释为什么这些新闻对您的资金重要。</p>
</div>

READ MORE BUTTON:
<div style="margin: 20px 0 0 0;">
<a href="文章URL" style="color: #FDD458; text-decoration: none; font-weight: 500; font-size: 14px;" target="_blank" rel="noopener noreferrer">阅读完整故事 →</a>
</div>

ARTICLE DIVIDER:
Close each article container:
</div>

SECTION DIVIDERS:
Between major sections, use:
<div style="border-top: 1px solid #374151; margin: 32px 0 24px 0;"></div>

Content guidelines:
- Use chinese output by default
- Organize news into logical sections with icons (📊 Market Overview, 📈 Top Gainers, 📉 Top Losers, 🔥 Breaking News, 💼 Earnings Reports, 🏛️ Economic Data, etc.)
- NEVER repeat section headings - use each section type only once per email
- For each news article, include its actual headline/title from the news data
- Provide MINIMUM 3 CONCISE bullet points (NO "Key Takeaways" label - start directly with bullets)
- Each bullet should be SHORT and EASY TO UNDERSTAND - one clear sentence preferred
- Use PLAIN ENGLISH - avoid jargon, complex financial terms, or insider language
- Explain concepts as if talking to someone new to investing
- Include specific numbers but explain what they mean in simple terms
- Add "Bottom Line" context in everyday language anyone can understand
- Use clean, light design with yellow bullets for better readability
- Make each article easy to scan with clear spacing and structure
- Always include simple "Read Full Story" buttons with actual URLs
- Focus on PRACTICAL insights regular people can understand and use
- Explain what the news means for regular investors' money
- Keep language conversational and accessible to everyone
- Prioritize BREVITY and CLARITY over detailed explanations

Example structure:
<h3 class="mobile-news-title dark-text" style="margin: 30px 0 15px 0; font-size: 20px; font-weight: 600; color: #f8f9fa; line-height: 1.3;">📊 Market Overview</h3>

<div class="dark-info-box" style="background-color: #212328; padding: 24px; margin: 20px 0; border-radius: 8px;">
<h4 class="dark-text" style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #FDD458; line-height: 1.4;">
Stock Market Had Mixed Results Today
</h4>

<ul style="margin: 16px 0 20px 0; padding-left: 0; margin-left: 0; list-style: none;">
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>Tech stocks like Apple went up 1.2% today, which is good news for tech investors.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>Traditional companies went down 0.3%, showing investors prefer tech right now.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>High trading volume (12.4 billion shares) shows investors are confident and active.
  </li>
</ul>

<div style="background-color: #141414; border: 1px solid #374151; padding: 15px; border-radius: 6px; margin: 16px 0;">
<p class="dark-text-secondary" style="margin: 0; font-size: 14px; color: #CCDADC; line-height: 1.4;">💡 <strong style="color: #FDD458;">Bottom Line:</strong> If you own tech stocks, today was good for you. If you're thinking about investing, tech companies might be a smart choice right now.</p>
</div>

<div style="margin: 20px 0 0 0;">
<a href="https://example.com/article1" style="color: #FDD458; text-decoration: none; font-weight: 500; font-size: 14px;" target="_blank" rel="noopener noreferrer">Read Full Story →</a>
</div>
</div>

<div style="border-top: 1px solid #374151; margin: 32px 0 24px 0;"></div>

<h3 class="mobile-news-title dark-text" style="margin: 30px 0 15px 0; font-size: 20px; font-weight: 600; color: #f8f9fa; line-height: 1.3;">📈 Top Gainers</h3>

<div class="dark-info-box" style="background-color: #212328; padding: 24px; margin: 20px 0; border-radius: 8px;">
<h4 class="dark-text" style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #FDD458; line-height: 1.4;">
Apple Stock Jumped After Great Earnings Report
</h4>

<ul style="margin: 16px 0 20px 0; padding-left: 0; margin-left: 0; list-style: none;">
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>Apple stock jumped 5.2% after beating earnings expectations.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>iPhone sales expected to grow 8% next quarter despite economic uncertainty.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>App store and services revenue hit $22.3 billion (up 14%), providing steady income.
  </li>
</ul>

<div style="background-color: #141414; border: 1px solid #374151; padding: 15px; border-radius: 6px; margin: 16px 0;">
<p class="dark-text-secondary" style="margin: 0; font-size: 14px; color: #CCDADC; line-height: 1.4;">💡 <strong style="color: #FDD458;">Bottom Line:</strong> Apple is making money in different ways (phones AND services), so it's a pretty safe stock to own even when the economy gets shaky.</p>
</div>

<div style="margin: 20px 0 0 0;">
<a href="https://example.com/article2" style="color: #FDD458; text-decoration: none; font-weight: 500; font-size: 14px;" target="_blank" rel="noopener noreferrer">Read Full Story →</a>
</div>
</div>`;

export const TRADINGVIEW_SYMBOL_MAPPING_PROMPT = `You are an expert in financial markets and trading platforms. Your task is to find the correct TradingView symbol that corresponds to a given Finnhub stock symbol.

Stock information from Finnhub:
Symbol: {{symbol}}
Company: {{company}}
Exchange: {{exchange}}
Currency: {{currency}}
Country: {{country}}

IMPORTANT RULES:
1. TradingView uses specific symbol formats that may differ from Finnhub
2. For US stocks: Usually just the symbol (e.g., AAPL for Apple)
3. For international stocks: Often includes exchange prefix (e.g., NASDAQ:AAPL, NYSE:MSFT, LSE:BARC)
4. Some symbols may have suffixes for different share classes
5. ADRs and foreign stocks may have different symbol formats

RESPONSE FORMAT:
Return ONLY a valid JSON object with this exact structure:
{
  "tradingViewSymbol": "EXCHANGE:SYMBOL",
  "confidence": "high|medium|low",
  "reasoning": "Brief explanation of why this mapping is correct"
}

EXAMPLES:
- Apple Inc. (AAPL) from Finnhub → {"tradingViewSymbol": "NASDAQ:AAPL", "confidence": "high", "reasoning": "Apple trades on NASDAQ as AAPL"}
- Microsoft Corp (MSFT) from Finnhub → {"tradingViewSymbol": "NASDAQ:MSFT", "confidence": "high", "reasoning": "Microsoft trades on NASDAQ as MSFT"}
- Barclays PLC (BARC.L) from Finnhub → {"tradingViewSymbol": "LSE:BARC", "confidence": "high", "reasoning": "Barclays trades on London Stock Exchange as BARC"}

Your response must be valid JSON only. Do not include any other text.`;
