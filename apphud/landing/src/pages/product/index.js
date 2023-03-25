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
import useScrollTop from "../../hooks/useScrollTop";

export default function product() {
  useScrollTop();

  return (
    <div className="wrapper">
      <Head>
        <title>Measure your in-app subscriptions – Apphud</title>
        <meta
          property="og:title"
          content="Mobile app tool for iOS and Android developers – Apphud"
        />
        <meta
          property="og:description"
          content="Mobile app tool for development: create automations
          called rules, reduce involuntary churn, build screens in visual editor without coding."
        />
        <meta property="og:url" content="https://apphud.com/marketing" />
        <meta property="og:image" content="/images/og/im_5.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_5.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Mobile app tool for iOS and Android developers – Apphud"
        />
        <meta
          property="twitter:description"
          content="Mobile app tool for development: create automations
          called rules, reduce involuntary churn, build screens in visual editor without coding."
        />
        <meta property="twitter:url" content="https://apphud.com/marketing" />
        <meta
          name="description"
          content="Mobile app tool for development: create automations
          called rules, reduce involuntary churn, build screens in visual editor without coding."
        />
      </Head>

      <TitleProduct
        title={"Earn more on in-app subscriptions"}
        text={
          <>
            Automatically win back lapsed customers. Increase trial conversion.
            <br />
            Reduce churn rate and get customers insights via A/B-tests
            <span className="soon" />
          </>
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

      <Description
        title={"Create automations\n called Rules"}
        description="Automatically send Push notifications with discounts to win back lapsed customers, receive user feedback and ask customers to update payment info in case of billing issue."
        img="create-automations"
        alt="create-automations"
      />

      <ProductSlider />

      <Description
        reverse
        title="Reduce involuntary churn"
        description="Ask customers to update their billing details in case of billing issue and reduce involuntary churn."
        img="reduce-churn"
        alt="reduce-churn"
      />

      <Description
        title={"Build screens in visual editor without coding"}
        description="Use powerful visual editor to build promo offer, survey, feedback and billing issue screens.​​​​​​​​​​​​​​"
        img="build-screen"
        alt="build-screen"
      />

      <ProductExperiment
        title={
          <>
            Run price experiments and get meaningful insights
            <span className="soon" />
          </>
        }
        text={
          "Create A/B-tests with payment screens directly in visual editor – fast and super-easy! \n Rely on power of data to boost your app revenue. "
        }
        img={"/images/product-experiment.svg"}
      />

      <div className="accordion">
        <div className="container">
          <h2>Got a question?</h2>
          <div className="accordion-items">
            <Accordion title="What does Apphud do?">
              Apphud is a platform for developers to integrate and analyze
              subscriptions in iOS and Android apps.
              <br />
              <br /> • Implement subscriptions in your mobile app in a few lines
              of code.
              <br /> • Non-renewing purchases are also supported.
              <br /> • View and analyze subscription metrics. Add Integrations a
              large set of analytics and marketing tools: Amplitude, Mixpanel,
              AppsFlyer, Branch, Adjust, etc.
              <br /> • Increase app revenue up to 5% by sending automated
              discounts for lapsed customers.
              <br /> • Learn why customers cancel trials and subscriptions.
              <br /> • Fix failed renewals by sending Push notifications and
              in-app reminders to update billing info.
            </Accordion>
            <Accordion title="What platforms do you support?">
              Currently we support iOS and Android.
            </Accordion>
            <Accordion title="Do I need to rewrite my purchase flow using Apphud SDK?">
              No. You don’t need to replace your existing code with Apphud SDK.
              You can run Apphud in observer mode and only listen for purchases.
            </Accordion>
            <Accordion title="Can I use Apphud just for analytics?">
              Yes, you can. In this case all you need is to integrate SDK.
              <br />
              <br /> You will be able to view Dashboard and Users list. However,
              if you want to use Integrations, you need to add more code. See
              docs describing how to add desired integration. If you would like
              to use Rules, implement Push Notifications, as described{" "}
              <a href="https://docs.apphud.com/getting-started/push">here</a>.
            </Accordion>
            <Accordion title="What are Screens? How to use Screens?">
              Screens are a part of Rules. As for now,{" "}
              <b>Rules are available only on iOS</b> you can only present
              Screens in your app by using Rules. There are 4 types of Screens
              are available now:
              <br />
              <br /> • <i>Promo offer screen</i>. To show a discount for lapsed
              or existing customers.
              <br /> • <i>Survey screen</i>. To ask a customer a question with a
              set of available options.
              <br /> • <i>Feedback screen</i>. To ask a customer for a text
              feedback.
              <br /> • <i>Billing issue screen</i>. To ask a user to update
              their billing info. Typically, used in case of billing issue.
            </Accordion>
            <Accordion title="Can I combine Screens?">
              Yes. You can combine different screens to implement complex
              scenarios. For example, you may create a survey with a set of
              options. You may also push another screen if user selects certain
              option. For example, you may push Promo offer screen with a
              discount for lapsed subscriber after a user selects “Too
              expensive” option when answering to a “Why did you cancel a
              subscription?” question.
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
