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
        <title>Send subscription events to OneSignal – Apphud</title>
        <meta
          property="og:title"
          content="Send subscription events to OneSignal – Apphud"
        />
        <meta
          property="og:description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to OneSignal."
        />
        <meta property="og:url" content="https://apphud.com/onesignal" />
          <meta property="og:image" content="/images/og/im_14.png" key="og:image" />
          <meta property="twitter:image" content="/images/og/im_14.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Send subscription events to OneSignal – Apphud"
        />
        <meta
          property="twitter:description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to OneSignal."
        />
        <meta property="twitter:url" content="https://apphud.com/onesignal" />
        <meta
          name="description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to OneSignal."
        />
      </Head>

      <TitleProduct
        icon={"/icons/integrations/onesignal.svg"}
        title={"Send subscription\n events to OneSignal"}
        text={
          "Send subscription events, like trial activations, renewals, cancellations and other to OneSignal."
        }
        actions={
          <a href="https://app.apphud.com/sign_up">
            <Button title="Start for Free" />
          </a>
        }
      />

      <Description
        title={"Send events to OneSignal"}
        description="Send almost 20 different subscription events to OneSignal. Including: Trial Started, Trial Converted, Subscription Started, Autorenew Enabled or Disabled, Promo Started etc."
        img="onesignal1"
        alt="Send events to OneSignal"
      />

      <Description
        reverse
        title="Run push campaigns based Apphud an-app subscriptions data"
        description="Create segments based on Apphud events in OneSignal to deliver special offers and win back lapsed subscribers through push notifications."
        img="onesignal2"
        alt="Run push campaigns based Apphud an-app subscriptions data"
      />

      <More
        title={"Have more questions?"}
        text={
          <span>
            Read the{" "}
            <a href="https://docs.apphud.com/integrations/marketing/onesignal">
              documentation
            </a>
          </span>
        }
      />

      <GetStarted />
    </div>
  );
}
