import Head from "next/head";
import TitleProduct from "components/sections/TitleProduct";
import Description from "components/sections/Description";
import More from "components/sections/More";
import GetStarted from "components/sections/GetStarted";
import Button from "components/UI/Button";
import { Feature, FeatureList } from "components/sections/FeatureList";
import useScrollTop from "../../hooks/useScrollTop";

export default function compare() {
  useScrollTop();

  return (
    <div className="wrapper">
      <Head>
        <title>Compare Apphud with RevenueCat</title>
        <meta property="og:title" content="Compare Apphud mobile app service with RevenueCat – Apphud" />
        <meta
          property="og:description"
          content="Compare Apphud mobile app service with RevenueCat: all charts and metrics included, integrations for free, online support for everyone."
        />
        <meta property="og:url" content="https://apphud.com/revenuecat" />
          <meta property="og:image" content="/images/og/im_10.png" key="og:image" />
          <meta property="twitter:image" content="/images/og/im_10.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Compare Apphud mobile app service with RevenueCat – Apphud"
        />
        <meta
          property="twitter:description"
          content="Compare Apphud mobile app service with RevenueCat: all charts and metrics included, integrations for free, online support for everyone."
        />
        <meta property="twitter:url" content="https://apphud.com/revenuecat" />
        <meta
          name="description"
          content="Compare Apphud mobile app service with RevenueCat: all charts and metrics included, integrations for free, online support for everyone."
        />
      </Head>

      <TitleProduct
        title={"Compare Apphud with RevenueCat"}
        text={
          "RevenueCat is another in-app purchases and subscription infrastructure service. \n Let’s see what differs us from them."
        }
        actions={
          <>
            <a href="https://app.apphud.com/sign_up">
              <Button title="Start for Free" />
            </a>
            <Button title="Talk to us" transparent className="open-chat" />
          </>
        }
      />

      <Description
        title={"What makes us different?"}
        description={
          "We believe that every team, even a small one should have a free in-app subscription infrastructure tool to grow their business.\n\n We provide a maximum of possibilities for startups in our Free plan – pay as you grow!"
        }
        img="revenuecat"
        alt="What makes us different?"
      />

      <FeatureList>
        <Feature
          img={"icons/features/charts.svg"}
          title={"All charts and metrics included"}
          text={
            "Full access to all charts and analytics data. Track money metrics, churn, conversions, and all events you receive from users.\n\n Unlimited and free."
          }
        />
        <Feature
          img={"icons/features/integrations.svg"}
          title={"Use integrations for free"}
          text={
            "Setup integrations with the most popular analytics and attribution platforms. \n\n Analyze Apple Search Ads campaigns, get notifications in Slack and Telegram, build custom data flows and many more."
          }
        />
        <Feature
          img={"icons/features/chat.svg"}
          title={"Online support for everyone"}
          text={
            "We are always online on online chat to help you – no matter what is your current MTR.\n\n Got a question? Feel free to chat with us."
          }
        />
        <Feature
          img={"icons/features/rules.svg"}
          title={"Rules and screens "}
          text={
            "Rules are seamless automation tool that helps to:\n\n – send Push notifications with discounts to win back lapsed customers;\n\n – receive user feedback;\n\n – ask customers to update payment info in case of billing issues."
          }
        />
        <Feature
          img={"icons/features/price.svg"}
          title={
            <>
              Price experiments
              <span className="soon" />
            </>
          }
          text={
            "Run A/B-experiments to find the optimal price that maximizes app revenue.\n\n Get insights and grow trial conversion and revenue. No coding required!"
          }
        />
      </FeatureList>

      <More
        title={"Need more details?"}
        text={
          <span>
            <a href="/pricing">View pricing</a>
          </span>
        }
      />

      <GetStarted />
    </div>
  );
}
