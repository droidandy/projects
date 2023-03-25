import Head from "next/head";
import TitleProduct from "components/sections/TitleProduct";
import Description from "components/sections/Description";
import Accordion from "components/sections/Accordion";
import More from "components/sections/More";
import GetStarted from "components/sections/GetStarted";
import Button from "components/UI/Button";
import useScrollTop from "../../hooks/useScrollTop";
import {AnimationMakingInApp} from "../../components/Animation";

export default function development() {
  useScrollTop();

  return (
    <div className="wrapper">
      <Head>
        <title>Easily integrate in-app subscriptions – Apphud</title>
        <meta
          property="og:title"
          content="Mobile app service for integration with iOS and Android in app subscriptions – Apphud"
        />
        <meta
          property="og:description"
          content="Integrate in app subscriptions in 3 lines of code. Mobile app service for integrations with iOS and Android in app subscriptions: implement offers without server."
        />
        <meta property="og:url" content="https://apphud.com/development" />
        <meta property="og:image" content="/images/og/im_6.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_6.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Mobile app service for integration with iOS and Android in app subscriptions – Apphud"
        />
        <meta
          property="twitter:description"
          content="Integrate in app subscriptions in 3 lines of code. Mobile app service for integrations with iOS and Android in app subscriptions: implement offers without server."
        />
        <meta property="twitter:url" content="https://apphud.com/development" />
        <meta
          name="description"
          content="Integrate in app subscriptions in 3 lines of code. Mobile app service for integrations with iOS and Android in app subscriptions: implement offers without server."
        />
      </Head>

      <TitleProduct
        title={"Easily integrate \nin-app subscriptions "}
        text={
          "Add all kinds of in-app purchases to your app in a minutes. Get subscription state of any user through powerful SDKs.\n Validate in-app purchases and implement subscription offers with no server code. "
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
        title="Integrate in-app subscriptions in a 3 lines of code. No server required"
        description="Our SDKs are simple and powerful. Implement in-app purchases without writing a single line of a custom code and setting up own server."
        linkPath="https://app.apphud.com/sign_up"
        linkText="Get your free API key now"
        img={(
            <AnimationMakingInApp />
        )}
        alt="mobile-in-app"
      />

      <Description
        reverse
        title="Check subscription state across different platforms"
        description="Forget about saving expiration date in the app local storage. Unlock premium features for iOS user if they purchased a subscription on Android and vice-versa."
        linkPath="https://docs.apphud.com"
        linkText="Explore documentation"
        img="check-subscription"
        alt="check-subscription"
      />

      <Description
        title={"Automatically validate\n in-app subscriptions"}
        description="Securely validate App Store and Google Play receipts. Prevent fraud transactions and do not unlock premium features for cheaters."
        linkPath="https://app.apphud.com/sign_up"
        linkText="Get your free API key now"
        img="automatically-validate"
        alt="automatically-validate"
      />

      <Description
        reverse
        title="Send subscription events to your server"
        description="Send subscription events to your server via webhooks. This might be useful if you have in-house analytics or want to implement custom logics."
        linkPath="https://app.apphud.com/sign_up"
        linkText="Get your free API key now"
        img="send-subscription"
        alt="send-subscription"
      />

      <Description
        title={"Easily integrate\n promotional offers"}
        description="Provide a discount for lapsed customers by using promotional offers. Check user eligibility to purchase promotional offer using our SDK. No server required."
        linkPath="https://docs.apphud.com"
        linkText="Explore documentation"
        img="easily-integrate"
        alt="easily-integrate"
      />

      <Description
        reverse
        title="Open source SDKs"
        description="All our SDKs are completely open source."
        linkPath="https://github.com/apphud"
        linkText="View Apphud on GitHub"
        img="open-source-sdk"
        alt="open-source-sdk"
      />

      <div className="accordion">
        <div className="container">
          <h2>Got a question?</h2>
          <div className="accordion-items">
            <Accordion title="What SDKs do you have?">
              We have iOS SDK written in Swift and Android SDK written in
              Kotlin. Our SDKs are open-source and published{" "}
              <a href="https://github.com/apphud">here</a>.
            </Accordion>
            <Accordion title="Do I need to rewrite my purchase flow using Apphud SDK?">
              No. You don’t need to replace your existing code with Apphud SDK.
              You can run Apphud in observer mode and only listen for purchases.
            </Accordion>
            <Accordion title="Do you have a REST API?">
              Yes. We have REST API to get current customer by their user ID.
              REST API is available on paid plans.
            </Accordion>
            <Accordion title="What are Webhooks? Do you have any?">
              Apphud can send POST requests to your server about subscription
              events. These requests are called Webhooks (server-to-server
              notifications). They are available on paid plans. You can use
              these events to implement custom logics or send data to in-house
              analytics. Read more about webhooks{" "}
              <a href="https://docs.apphud.com/integrations/webhook">here</a>.
            </Accordion>
            <Accordion title="What will happen if your server is down? Is Apphud stable?">
              Apphud is absolutely stable. Most of the data is cached on device.
              However, if there are issues with subscription verification, our
              SDK tries to re-submit data until success.
            </Accordion>
            <Accordion title="Can I use Apphud to sign my subscription offers?">
              Yes, you can. Just follow{" "}
              <a href="https://docs.apphud.com/getting-started/promo-offers">
                this guide
              </a>
              .
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
