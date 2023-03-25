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
        <title>Send Subscription Events to Firebase – Apphud</title>
        <meta
          property="og:title"
          content="Send Subscription Events to Firebase – Apphud"
        />
        <meta
          property="og:description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Firebase Ads Manager and Firebase Analytics."
        />
        <meta property="og:url" content="https://apphud.com/firebase" />
        <meta property="og:image" content="/images/og/im_24.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_24.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Send Subscription Events to Firebase – Apphud"
        />
        <meta
          property="twitter:description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Firebase Ads Manager and Firebase Analytics."
        />
        <meta property="twitter:url" content="https://apphud.com/firebase" />
        <meta
          name="description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Firebase Ads Manager and Firebase Analytics."
        />
      </Head>

      <TitleProduct
        icon={"/icons/integrations/firebase.svg"}
        title={"Send subscription\n events to Firebase"}
        text={
          "Send subscription events, like trial activations, renewals, cancellations and others to Firebase."
        }
        actions={
          <a href="https://app.apphud.com/sign_up">
            <Button title="Start for Free" />
          </a>
        }
      />

      <Description
        title={"Send events to Firebase and Google Analytics"}
        description="Send almost 20 different subscription events to Firebase and Google Analytics. Including: Trial Started, Trial Converted, Subscription Started, Autorenew Enabled or Disabled, Promo Started and others."
        img="firebase1"
        alt="Send events to Firebase and Google Analytics"
      />

      <Description
        reverse
        title="Create A/B-tests using Apphud events"
        description="Improve Firebase experiments by setting goals that will lead to more key actions like trial start/conversion, subscriptions start etc. Use Apphud events as a target metric in A/B-tests."
        img="firebase2"
        alt="Create A/B-tests using Apphud events"
      />

      <Description
        title={"Run Google Ads campaigns, optimized for subscription revenue"}
        description="Use Apphud events from Firebase as a Google Ads campaign optimization metric. Doing so, you will get more relevant audience and boost in-app’s revenue and LTV."
        img="firebase3"
        alt="Run Google Ads campaigns, optimized for subscription revenue"
      />

      <More
        title={"Have more questions?"}
        text={
          <span>
            Read the{" "}
            <a href="https://docs.apphud.com/integrations/analytics/firebase">
              documentation
            </a>
          </span>
        }
      />

      <GetStarted />
    </div>
  );
}
