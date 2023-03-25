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
        <title>Send Subscription Events to Mixpanel – Apphud</title>
        <meta
          property="og:title"
          content="Send Subscription Events to Mixpanel – Apphud"
        />
        <meta
          property="og:description"
          content="Send subscription events, like trial activations, renewals, cancellations and others to Mixpanel."
        />
        <meta property="og:url" content="https://apphud.com/mixpanel" />
        <meta property="og:image" content="/images/og/im_25.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_25.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Send Subscription Events to Mixpanel – Apphud"
        />
        <meta
          property="twitter:description"
          content="Send subscription events, like trial activations, renewals, cancellations and others to Mixpanel."
        />
        <meta property="twitter:url" content="https://apphud.com/mixpanel" />
        <meta
          name="description"
          content="Send subscription events, like trial activations, renewals, cancellations and others to Mixpanel."
        />
      </Head>

      <TitleProduct
        icon={"/icons/integrations/mixpanel.svg"}
        title={"Send subscription\n events to Mixpanel"}
        text={
          "Send subscription events, like trial activations, renewals, cancellations and others to Mixpanel."
        }
        actions={
          <a href="https://app.apphud.com/sign_up">
            <Button title="Start for Free" />
          </a>
        }
      />

      <Description
        title={"Send events to Mixpanel"}
        description="Send almost 20 different subscription events to Mixpanel. Including: Trial Started, Trial Converted, Subscription Started, Autorenew Enabled or Disabled, Promo Started and others."
        img="mixpanel1"
        alt="Send events to Mixpanel"
      />

      <Description
        reverse
        title="Send subscription information to user profile"
        description="Apphud automatically sends useful information to user profile. Get a better picture of user behaviour in your app."
        img="mixpanel2"
        alt="Send subscription information to user profile"
      />

      <Description
        title={"Report gross or net revenue to Mixpanel"}
        description="Report subscription revenue to Amplitude. Choose between reporting gross revenue or net revenue without Apple commission."
        img="mixpanel3"
        alt="Report gross or net revenue to Mixpanel"
      />

      <More
        title={"Have more questions?"}
        text={
          <span>
            Read the{" "}
            <a href="https://docs.apphud.com/integrations/analytics/mixpanel">
              documentation
            </a>
          </span>
        }
      />

      <GetStarted />
    </div>
  );
}
