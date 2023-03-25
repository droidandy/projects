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
        <title>Send Subscription Events to Tenjin – Apphud</title>
        <meta
          property="og:title"
          content="Send Subscription Events to Tenjin – Apphud"
        />
        <meta
          property="og:description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Tenjin. Receive attribution info from Tenjin to Apphud."
        />
        <meta property="og:url" content="https://apphud.com/tenjin" />
          <meta property="og:image" content="/images/og/im_15.png" key="og:image" />
          <meta property="twitter:image" content="/images/og/im_15.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Send Subscription Events to Tenjin – Apphud"
        />
        <meta
          property="twitter:description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Tenjin. Receive attribution info from Tenjin to Apphud."
        />
        <meta property="twitter:url" content="https://apphud.com/tenjin" />
        <meta
          name="description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Tenjin. Receive attribution info from Tenjin to Apphud."
        />
      </Head>

      <TitleProduct
        icon={"/icons/integrations/tenjin.png"}
        title={"Send subscription\n events to Tenjin"}
        text={
          "Send subscription events, like trial activations, renewals, cancellations and other to Tenjin.\n Analyze revenue metrics segmented by attribution data from Tenjin."
        }
        actions={
          <a href="https://app.apphud.com/sign_up">
            <Button title="Start for Free" />
          </a>
        }
      />

      <Description
        title={"Send events to Tenjin"}
        description="Send almost 20 different subscription events to Tenjin. Including: Trial Started, Trial Converted, Subscription Started, Autorenew Enabled or Disabled, Promo Started etc."
        img="tenjin1"
        alt="Send events to Tenjin"
      />

      <Description
        reverse
        title="Send correct revenue to Tenjin"
        description="Apphud instantly sends revenue events to Tenjin. Thus Tenjin will show correct revenue in a Dashboard."
        img="tenjin2"
        alt="Send correct revenue to Tenjin"
      />

      <Description
        title={"View subscriptions metrics by attribution channel"}
        description="View key subscription metrics like Gross Revenue or Monthly Recurring Revenue by attribution channel right on Apphud dashboard."
        img="tenjin3"
        alt="View subscriptions metrics by attribution channel"
      />

      <More
        title={"Have more questions?"}
        text={
          <span>
            Read the{" "}
            <a href="https://docs.apphud.com/integrations/attribution/tenjin">
              documentation
            </a>
          </span>
        }
      />

      <GetStarted />
    </div>
  );
}
