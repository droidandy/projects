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
        <title>Send subscription events to Segment – Apphud</title>
        <meta
          property="og:title"
          content="Send subscription events to Segment – Apphud"
        />
        <meta
          property="og:description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Segment."
        />
        <meta property="og:url" content="https://apphud.com/segment" />
          <meta property="og:image" content="/images/og/im_13.png" key="og:image" />
          <meta property="twitter:image" content="/images/og/im_13.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Send subscription events to Segment – Apphud"
        />
        <meta
          property="twitter:description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Segment."
        />
        <meta property="twitter:url" content="https://apphud.com/segment" />
        <meta
          name="description"
          content="Send subscription events, like trial activations, renewals, cancellations and other to Segment."
        />
      </Head>

      <TitleProduct
        icon={"/icons/integrations/segment.svg"}
        title={"Send subscription\n events to Segment"}
        text={
          "Send subscription events, like trial activations, renewals, cancellations and other to Segment."
        }
        actions={
          <a href="https://app.apphud.com/sign_up">
            <Button title="Start for Free" />
          </a>
        }
      />

      <Description
        title={"Send events to Segment"}
        description="Send almost 20 different subscription events to Tenjin. Including: Trial Started, Trial Converted, Subscription Started, Autorenew Enabled or Disabled, Promo Started and others. "
        img="segment1"
        alt="Send events to Segment"
      />

      <Description
        reverse
        title="The ultimate data pipeline"
        description="Segment is a great tool to implement any custom workflows and scenarios for events that came from Apphud.\n Explore Segment's destinations to send your subscription data anywhere you need it."
        img="segment2"
        alt="The ultimate data pipeline"
      />

      <More
        title={"Have more questions?"}
        text={
          <span>
            Read the{" "}
            <a href="https://docs.apphud.com/integrations/data-platforms/segment">
              documentation
            </a>
          </span>
        }
      />

      <GetStarted />
    </div>
  );
}
