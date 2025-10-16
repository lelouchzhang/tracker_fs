
import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { getNews } from "../actions/finnhub.actions";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { inngest } from "./client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompt";
import { getFormattedTodayDate } from "../utils";

export const sendSignUpEmail = inngest.createFunction(
  { id: "sign-up-email" },
  { event: "app/user.created" },
  async ({ event, step }) => {
    const userProfile = `
          - Country: ${event.data.country}
          - Investment goals: ${event.data.investmentGoals}
          - Risk tolerance: ${event.data.riskTolerance}
          - Preferred industry: ${event.data.preferredIndustry}
      `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{userProfile}}",
      userProfile
    );

    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    await step.run("send-welcome-email", async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0];
      const introText =
        (part && "text" in part ? part.text : null) ||
        "感谢您使用 Signalist, 一个可以跟踪市场并采取更明智行动的工具。";

      const {
        data: { email, name },
      } = event;

      console.log(event);

      return await sendWelcomeEmail({ email, name, intro: introText });
    });

    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  }
);

export const sendDailyNewsSummary = inngest.createFunction(
  { id: "daily-news-summary" },
  [{ event: 'app/send.daily.news' }, {
    // cron: '*/5 * * * *'
    cron: '0 12 * * *'
  }],
  async ({ step }) => {
    // 1. Get all users for news delivery
    const users = await step.run('get-all-users', getAllUsersForNewsEmail)

    if (users.length === 0) {
      return { success: false, message: '未找到任何定制了推送的用户' }
    }

    // 2. For each user, get their watchlist symbols and fetch news
    const results = await step.run('fetch-news-for-user', async () => {
      const eachUser: Array<{ user: User; articles: MarketNewsArticle[] }> = [];
      for (const user of users as User[]) {
        try {
          const symbols = await getWatchlistSymbolsByEmail(user.email);
          let articles = await getNews(symbols);
          articles = (articles || []).slice(0, 6);

          if (!articles || articles.length === 0) {
            articles = await getNews();
            articles = (articles || []).slice(0, 6);
          }
          eachUser.push({ user, articles })
        } catch (error) {
          console.error('Error fetching news for user', user.email, error)
          eachUser.push({ user, articles: [] })
        }
      }
      return eachUser;
    })

    // Step #3: (placeholder) Summarize news via AI
    const userNewsSummaries: { user: User; newsContent: string | null }[] = [];

    for (const { user, articles } of results as unknown as any[]) {
      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(articles, null, 2));

        const response = await step.ai.infer(`summarize-news-${user.email}`, {
          model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
          body: {
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
          }
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        const newsContent = (part && 'text' in part ? part.text : null) || 'No market news.'

        userNewsSummaries.push({ user, newsContent });
      } catch (error: any) {
        console.error(`AI inference failed for user ${user.email}:`, {
          error: error.message,
          stack: error.stack,
          url: error.config?.url, // 如果有请求URL信息
          status: error.response?.status,
          data: error.response?.data
        })
      }

      // Step #4: (placeholder) Send the emails
      await step.run('send-news-emails', async () => {
        await Promise.all(
          userNewsSummaries.map(async ({ user, newsContent }) => {
            if (!newsContent) return false;

            return await sendNewsSummaryEmail({ email: user.email, date: getFormattedTodayDate(), newsContent })
          })
        )
      })

      return { success: true, message: 'Daily news summary emails sent successfully' }
    }
  }
)