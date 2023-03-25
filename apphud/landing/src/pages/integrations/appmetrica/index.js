import Head from "next/head";
import TitleProduct from "components/sections/TitleProduct";
import More from "components/sections/More";
import GetStarted from "components/sections/GetStarted";
import Button from "components/UI/Button";
import ProductExperiment from "components/sections/ProductExperiment";
import useScrollTop from "../../../hooks/useScrollTop";

export default function integration() {
  useScrollTop();

  return (
    <div className="wrapper">
      <Head>
        <title>Send Subscription Events to AppMetrica – Apphud</title>
        <meta
          property="og:title"
          content="Send Subscription Events to AppMetrica – Apphud"
        />
        <meta
          property="og:description"
          content="Send subscription events, like trial activations, renewals and cancellations to AppMetrica."
        />
        <meta property="og:url" content="https://apphud.com/appmetrica" />
          <meta property="og:image" content="/images/og/im_16.png" key="og:image" />
          <meta property="twitter:image" content="/images/og/im_16.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Send Subscription Events to AppMetrica – Apphud"
        />
        <meta
          property="twitter:description"
          content="Send subscription events, like trial activations, renewals and cancellations to AppMetrica."
        />
        <meta property="twitter:url" content="https://apphud.com/appmetrica" />
        <meta
          name="description"
          content="Send subscription events, like trial activations, renewals and cancellations to AppMetrica."
        />
      </Head>

      <TitleProduct
        icon={"/icons/integrations/appmetrica.svg"}
        title={"Send subscription\n events to AppMetrica"}
        text={
          "Send subscription events, like trial activations, renewals and cancellations to AppMetrica."
        }
        actions={
          <a href="https://app.apphud.com/sign_up">
            <Button title="Start for Free" />
          </a>
        }
      />

      <ProductExperiment
        title={"Send events to AppMetrica"}
        text={
          "Send almost 20 different subscription events to AppMetrica. Including: Trial Started, Trial Converted, Subscription Started, Autorenew Enabled or Disabled, Promo Started etc. "
        }
        img={"/images/appmetrica.svg"}
      />

      <More
        title={"Have more questions?"}
        text={
          <span>
            Read the{" "}
            <a href="https://docs.apphud.com/integrations/analytics/appmetrica">
              documentation
            </a>
          </span>
        }
      />

      <GetStarted />
    </div>
  );
}
