import Head from "next/head";
import TitleProduct from "components/sections/TitleProduct";
import Description from "components/sections/Description";
import Accordion from "components/sections/Accordion";
import More from "components/sections/More";
import GetStarted from "components/sections/GetStarted";
import Button from "components/UI/Button";
import MarketingIntegrations from "components/sections/MarketingIntegrations";
import MarketingSlider from "components/sections/MarketingSlider";
import useScrollTop from "../../hooks/useScrollTop";

export default function marketing() {
  useScrollTop();

  return (
    <div className="wrapper">
      <Head>
        <title>Measure your in-app subscriptions – Apphud</title>
        <meta
          property="og:title"
          content="Mobile app tool for marketing: measure in app subscriptions – Apphud"
        />
        <meta
          property="og:description"
          content="Mobile app tool for marketing: analyze in app subscriptions, view key metrics, send subscription events to other analytics. Receive notifications to Slack and Telegram."
        />
        <meta property="og:url" content="https://apphud.com/marketing" />
        <meta property="og:image" content="/images/og/im_3.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_3.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Mobile app tool for marketing: measure in app subscriptions – Apphud"
        />
        <meta
          property="twitter:description"
          content="Mobile app tool for marketing: analyze in app subscriptions, view key metrics, send subscription events to other analytics. Receive notifications to Slack and Telegram."
        />
        <meta property="twitter:url" content="https://apphud.com/marketing" />
        <meta
          name="description"
          content="Mobile app tool for marketing: analyze in app subscriptions, view key metrics, send subscription events to other analytics. Receive notifications to Slack and Telegram."
        />
      </Head>

      <TitleProduct
        title={"Measure your in-app subscriptions"}
        text={
          "View key metrics. Send subscription events to other analytics.\n Receive notifications to Slack and Telegram."
        }
        actions={
          <>
            <a href="https://app.apphud.com/sign_up">
              <Button title="Start for Free" />
            </a>
            <Button title="Talk to us" transparent className="open-chat" />
          </>
        }
      />

      <MarketingSlider />

      <MarketingIntegrations />

      <Description
        title={"Receive notifications to messengers"}
        description="Apphud instantly notifies you in Slack and Telegram when customer starts trial, cancels autorenewal, gets billed, makes a refund and so on."
        img="recieve-notifications"
        alt="recieve-notifications"
      />

      <Description
        reverse
        title="Updates in a real time"
        description="You don’t need to wait for App Store Connect and Google Play reports anymore. Apphud receives all data in a real time."
        img="updates-in-real-time"
        alt="updates-in-real-time"
      />

      <div className="accordion">
        <div className="container">
          <h2>Got a question?</h2>
          <div className="accordion-items">
            <Accordion title="Can I use Apphud just for analytics?">
              Yes, you can. In this case all you need is to integrate SDK.
              <br />
              <br /> You will be able to view Dashboard and Users list. However,
              if you want to use Integrations, you need to add more code. See
              docs describing how to add desired integration. If you would like
              to use Rules, implement Push Notifications, as described{" "}
              <a href="https://docs.apphud.com/getting-started/push">here</a>.
            </Accordion>
            <Accordion title="What timezone is used in Apphud?">
              For dashboard we use UTC timezone. However, when viewing user
              page, all dates are displayed in your browser's timezone.
            </Accordion>
            <Accordion title="How do you convert currencies?">
              US Dollar is a base currency in Apphud. All transactions are
              automatically converted to USD by the exchange rates at the time
              of event using{" "}
              <a href="https://openexchangerates.org">OpenExchangeRates</a>. We
              update conversion rates several times a day.
            </Accordion>
            <Accordion title="What currency do you use for sending revenue in Integrations?">
              When sending revenue to 3rd party analytics platforms, we send
              local currency where applicable. In particular, we send revenue in
              local currency to AppsFlyer, Branch and Adjust and send revenue in
              USD to Amplitude and Mixpanel.
            </Accordion>
            <Accordion title="Do you support Google Play promo-codes?">
              Yes.
            </Accordion>
            <Accordion title="What will happen if I exceed the free plan limit? Will Apphud continue working?">
              Once you exceed the free plan limit, 14-days grace period will
              start. During this time you should choose and activate paid plan.
              Otherwise, Integrations and Rules will stop working. Nonetheless,
              the core functionality of Apphud won’t be disabled. Thus, in-app
              purchases will continue working in your app.
            </Accordion>
            <Accordion title="Have more questions?">
              Read the <a href="https://docs.apphud.com/">documentation</a>
            </Accordion>
          </div>
        </div>
      </div>

      <GetStarted />
    </div>
  );
}
