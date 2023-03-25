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
        <title>Send Subscription Events to Branch – Apphud</title>
        <meta
          property="og:title"
          content="Send Subscription Events to Branch – Apphud"
        />
        <meta
          property="og:description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Branch. Receive attribution info from Branch to Apphud."
        />
        <meta property="og:url" content="https://apphud.com/branch" />
          <meta property="og:image" content="/images/og/im_22.png" key="og:image" />
          <meta property="twitter:image" content="/images/og/im_22.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Send Subscription Events to Branch – Apphud"
        />
        <meta
          property="twitter:description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Branch. Receive attribution info from Branch to Apphud."
        />
        <meta property="twitter:url" content="https://apphud.com/branch" />
        <meta
          name="description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Branch. Receive attribution info from Branch to Apphud."
        />
      </Head>

      <TitleProduct
        icon={"/icons/integrations/branch.svg"}
        title={"Send subscription\n events to Branch"}
        text={
          "Send subscription events, like trial activations, renewals, cancellations and other to Branch.\n Analyze revenue metrics segmented by attribution data from Branch."
        }
        actions={
          <a href="https://app.apphud.com/sign_up">
            <Button title="Start for Free" />
          </a>
        }
      />

      <Description
        title={"Send events to Branch"}
        description="Send almost 20 different subscription events to Branch. Including: Trial Started, Trial Converted, Subscription Started, Autorenew Enabled or Disabled, Promo Started and others. "
        img="branch1"
        alt="Send events to Branch"
      />

      <Description
        reverse
        title="Send correct revenue to Branch"
        description="Apphud instantly sends revenue events to Branch. Thus Branch will show correct revenue in a Dashboard."
        img="branch2"
        alt="Send correct revenue to Branch"
      />

      <Description
        title={"View subscriptions metrics by attribution channel"}
        description="View key subscription metrics like Gross Revenue or Monthly Recurring Revenue by attribution channel right on Apphud dashboard."
        img="branch3"
        alt="View subscriptions metrics by attribution channel"
      />

      <More
        title={"Have more questions?"}
        text={
          <span>
            Read the{" "}
            <a href="https://docs.apphud.com/integrations/attribution/branch">
              documentation
            </a>
          </span>
        }
      />

      <GetStarted />
    </div>
  );
}
