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
        <meta property="og:image" content="/images/og/im_24.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_24.png" key="twitter:image" />
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
        icon={"/icons/integrations/facebook.svg"}
        title={"Send subscription\n events to Facebook"}
        text={
          "Send subscription events, like trial activations, renewals, cancellations\n and others to Facebook Ads Manager and Facebook Analytics."
        }
        actions={
          <a href="https://app.apphud.com/sign_up">
            <Button title="Start for Free" />
          </a>
        }
      />

      <Description
        title={"Send events to Facebook"}
        description="Send almost 20 different subscription events to Facebook. Including: Trial Started, Trial Converted, Subscription Started, Autorenew Enabled or Disabled, Promo Started and other."
        img="facebook1"
        alt="Send events to Facebook"
      />

      <Description
        reverse
        title="Create lookalike audiences in Facebook Ads Manager based on events"
        description="Start Facebook ad campaigns targeted to the most valuable customers. Create lookalike audiences based on subscription events to maximize ads ROI."
        img="facebook2"
        alt="Create lookalike audiences in Facebook Ads Manager based on events"
      />

      <Description
        title={"Send correct revenue to Facebook"}
        description="Apphud instantly sends revenue events to Facebook. Thus, Facebook will show correct revenue metrics value in Facebook Analytics."
        img="facebook3"
        alt="Send correct revenue to Facebook"
      />

      <More
        title={"Have more questions?"}
        text={
          <span>
            Read the{" "}
            <a href="https://docs.apphud.com/integrations/attribution/facebook">
              documentation
            </a>
          </span>
        }
      />

      <GetStarted />
    </div>
  );
}
