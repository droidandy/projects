import Head from "next/head";
import TitleProduct from "components/sections/TitleProduct";
import Description from "components/sections/Description";
import More from "components/sections/More";
import GetStarted from "components/sections/GetStarted";
import Button from "components/UI/Button";
import useScrollTop from "../../../hooks/useScrollTop";

export default function integration() {
  useScrollTop();

  return (
    <div className="wrapper">
      <Head>
        <title>Send Subscription Events to Telegram – Apphud</title>
        <meta
          property="og:title"
          content="Send Subscription Events to Telegram – Apphud"
        />
        <meta
          property="og:description"
          content="Get instantly notified when user starts trial, cancels subscription, gets billed, makes a refund and so on."
        />
        <meta property="og:url" content="https://apphud.com/telegram" />
          <meta property="og:image" content="/images/og/im_19.png" key="og:image" />
          <meta property="twitter:image" content="/images/og/im_19.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Send Subscription Events to Telegram – Apphud"
        />
        <meta
          property="twitter:description"
          content="Get instantly notified when user starts trial, cancels subscription, gets billed, makes a refund and so on."
        />
        <meta property="twitter:url" content="https://apphud.com/telegram" />
        <meta
          name="description"
          content="Get instantly notified when user starts trial, cancels subscription, gets billed, makes a refund and so on."
        />
      </Head>

      <TitleProduct
        icon={"/icons/integrations/telegram.svg"}
        title={"Send subscription\n events to Telegram"}
        text={
          "Get instantly notified when user starts trial, cancels subscription, gets billed, makes a refund and so on."
        }
        actions={
          <a href="https://app.apphud.com/sign_up">
            <Button title="Start for Free" />
          </a>
        }
      />

      <Description
        title={"Receive notifications in Telegram"}
        description="Apphud instantly notifies you in Telegram when customer starts trial, cancels autorenewal, gets billed, makes a refund and so on."
        img="telegram1"
        alt="Receive notifications in Telegram"
      />

      <Description
        reverse
        title="Jump directly to a user from Telegram"
        description="Instantly see who made cancelled a subscription or made a refund and contact this customer to prevent churn."
        img="telegram2"
        alt="Jump directly to a user from Telegram"
      />

      <More
        title={"Have more questions?"}
        text={
          <span>
            Read the{" "}
            <a href="https://docs.apphud.com/integrations/messengers/telegram">
              documentation
            </a>
          </span>
        }
      />

      <GetStarted />
    </div>
  );
}
