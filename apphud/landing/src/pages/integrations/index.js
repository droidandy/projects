import Head from "next/head";
import TitleProduct from "components/sections/TitleProduct";
import Description from "components/sections/Description";
import Accordion from "components/sections/Accordion";
import More from "components/sections/More";
import GetStarted from "components/sections/GetStarted";
import Button from "components/UI/Button";
import MarketingIntegrations from "components/sections/MarketingIntegrations";
import MarketingSlider from "components/sections/MarketingSlider";
import ProductSlider from "components/sections/ProductSlider";
import ProductExperiment from "components/sections/ProductExperiment";
import IntegrationGrid from "components/sections/IntegrationGrid";
import useScrollTop from "../../hooks/useScrollTop";

export default function integrations() {
  useScrollTop();

  return (
    <div className="wrapper">
      <Head>
        <title>
          Sync in-app subscriptions with external apps and services – Apphud
        </title>
        <meta
          property="og:title"
          content="Mobile app service for sync in app subscriptions with external apps and services – Apphud"
        />
        <meta
          property="og:description"
          content="Mobile app service for integrations with external services: send subscription events to Amplitude, Mixpanel, AppsFlyer, Branch, Adjust, Slack and Telegram. "
        />
        <meta property="og:url" content="https://apphud.com/integrations" />
        <meta property="og:image" content="/images/og/im_4.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_4.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Sync in-app subscriptions with external apps and services – Apphud"
        />
        <meta
          property="twitter:description"
          content="Mobile app service for integrations with external services: send subscription events to Amplitude, Mixpanel, AppsFlyer, Branch, Adjust, Slack and Telegram. "
        />
        <meta property="twitter:url" content="https://apphud.com/integrations" />
        <meta
          name="description"
          content="Mobile app service for integrations with external services: send subscription events to Amplitude, Mixpanel, AppsFlyer, Branch, Adjust, Slack and Telegram. "
        />
      </Head>

      <TitleProduct
        title={"Sync in-app subscriptions with external apps and services"}
        text={
          "Easily integrate your in-app subscriptions with mobile analytics, marketing tools and messengers."
        }
        actions={
          <a href="https://app.apphud.com/sign_up">
            <Button title="Start for Free" />
          </a>
        }
        soon
      />

      <IntegrationGrid />

      <GetStarted />
    </div>
  );
}
