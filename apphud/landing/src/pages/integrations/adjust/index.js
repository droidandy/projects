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
        <title>Send Subscription Events to Adjust – Apphud</title>
        <meta
          property="og:title"
          content="Send Subscription Events to Adjust – Apphud"
        />
        <meta
          property="og:description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Adjust. Receive attribution info from Adjust to Apphud."
        />
        <meta property="og:url" content="https://apphud.com/adjust" />
          <meta property="og:image" content="/images/og/im_21.png" key="og:image" />
          <meta property="twitter:image" content="/images/og/im_21.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Send Subscription Events to Adjust – Apphud"
        />
        <meta
          property="twitter:description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Adjust. Receive attribution info from Adjust to Apphud."
        />
        <meta property="twitter:url" content="https://apphud.com/adjust" />
        <meta
          name="description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Adjust. Receive attribution info from Adjust to Apphud."
        />
      </Head>

      <TitleProduct
        icon={"/icons/integrations/adjust.svg"}
        title={"Send subscription\n events to Adjust"}
        text={
          "Send subscription events, like trial activations, renewals, cancellations and other to Adjust. \nAnalyze revenue metrics segmented by attribution data from Adjust."
        }
        actions={
          <a href="https://app.apphud.com/sign_up">
            <Button title="Start for Free" />
          </a>
        }
      />

      <Description
        title={"Send events to Adjust"}
        description="Send almost 20 different subscription events to Adjust. Including: Trial Started, Trial Converted, Subscription Started, Autorenew Enabled or Disabled, Promo Started and others. ."
        img="adjust1"
        alt="Send events to Adjust"
      />

      <Description
        reverse
        title="Send correct revenue to Adjust"
        description="Apphud instantly sends revenue events to Adjust. Thus Adjust will show correct revenue in a Dashboard."
        img="adjust2"
        alt="Send correct revenue to Adjust"
      />

      <Description
        title={"View subscriptions metrics by attribution channel"}
        description="Apphud instantly sends revenue events to Facebook. Thus, Facebook will show correct revenue metrics value in Facebook Analytics."
        img="adjust3"
        alt="View subscriptions metrics by attribution channel"
      />

      <More
        title={"Have more questions?"}
        text={
          <span>
            Read the{" "}
            <a href="https://docs.apphud.com/integrations/attribution/adjust">
              documentation
            </a>
          </span>
        }
      />

      <GetStarted />
    </div>
  );
}
