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
        <title>Send Subscription Events to Facebook – Apphud</title>
        <meta
          property="og:title"
          content="Send Subscription Events to Facebook – Apphud"
        />
        <meta
          property="og:description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Facebook Ads Manager and Facebook Analytics."
        />
        <meta property="og:url" content="https://apphud.com/facebook" />
          <meta property="og:image" content="/images/og/im_23.png" key="og:image" />
          <meta property="twitter:image" content="/images/og/im_23.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Send Subscription Events to Facebook – Apphud"
        />
        <meta
          property="twitter:description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Facebook Ads Manager and Facebook Analytics."
        />
        <meta property="twitter:url" content="https://apphud.com/facebook" />
        <meta
          name="description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Facebook Ads Manager and Facebook Analytics."
        />
      </Head>

      <TitleProduct
        icon={"/icons/integrations/appsflyer.svg"}
        title={"Send subscription\n events to AppsFlyer"}
        text={
          "Send subscription events, like trial activations, renewals, cancellations and other to AppsFlyer.\n Analyze revenue metrics segmented by attribution data from AppsFlyer."
        }
        actions={
          <a href="https://app.apphud.com/sign_up">
            <Button title="Start for Free" />
          </a>
        }
      />

      <Description
        title={"Send events to AppsFlyer"}
        description="Send almost 20 different subscription events to AppsFlyer. Including: Trial Started, Trial Converted, Subscription Started, Autorenew Enabled or Disabled, Promo Started and others. "
        img="appsflyer1"
        alt="Send events to AppsFlyer"
      />

      <Description
        reverse
        title="Send correct revenue to AppsFlyer"
        description="Apphud instantly sends revenue events to AppsFlyer. Thus AppsFlyer will show correct LTV value in a Dashboard."
        img="appsflyer2"
        alt="Send correct revenue to AppsFlyer"
      />

      <Description
        title={"View subscriptions metrics by attribution channel"}
        description="View key subscription metrics like Gross Revenue or Monthly Recurring Revenue by attribution channel right on Apphud dashboard."
        img="appsflyer3"
        alt="View subscriptions metrics by attribution channel"
      />

      <More
        title={"Have more questions?"}
        text={
          <span>
            Read the{" "}
            <a href="https://docs.apphud.com/integrations/attribution/appsflyer">
              documentation
            </a>
          </span>
        }
      />

      <GetStarted />
    </div>
  );
}
