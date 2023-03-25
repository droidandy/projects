import Head from "next/head";
import TitleProduct from "components/sections/TitleProduct";
import Description from "components/sections/Description";
import More from "components/sections/More";
import GetStarted from "components/sections/GetStarted";
import Button from "components/UI/Button";
import { Feature, FeatureList } from "components/sections/FeatureList";
import useScrollTop from "../../hooks/useScrollTop";
import {AnimationInHouse} from "../../components/Animation";

export default function compare() {
  useScrollTop();

  return (
    <div className="wrapper">
      <Head>
        <title>Compare Apphud with in-house platform</title>
        <meta
          property="og:title"
          content="Compare Apphud mobile app service with in house platform – Apphud"
        />
        <meta
          property="og:description"
          content="Compare Apphud mobile app service with in house platform: focus on your product.Rely in-app subscriptions infrastructure on us."
        />
        <meta property="og:url" content="https://apphud.com/in-house" />
        <meta property="og:image" content="/images/og/im_12.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_12.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Compare Apphud mobile app service with in house platform – Apphud"
        />
        <meta
          property="twitter:description"
          content="Compare Apphud mobile app service with in house platform: focus on your product.Rely in-app subscriptions infrastructure on us."
        />
        <meta property="twitter:url" content="https://apphud.com/in-house" />
        <meta
          name="description"
          content="Compare Apphud mobile app service with in house platform: focus on your product.Rely in-app subscriptions infrastructure on us."
        />
      </Head>

      <TitleProduct
        title={"Compare Apphud with in-house platform"}
        text={
          "Save your time and focus on the main thing that matters – your product.\n Rely in-app subscriptions infrastructure on us."
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
        title={"Get rid of in-app subscription’s infrastructure headache   "}
        description={
          "Why this is so important?\n Just because you have a lot of things to do: new features, design improvements,  monetizations experiments, and so on.\n Furthermore, Apphud is not only about in-app subscriptions & purchases. Our goal is to provide a complete stack to measure and grow payments in your apps."
        }
        img={(
            <AnimationInHouse />
        )}
        alt="Get rid of in-app subscription’s infrastructure headache   "
      />

      <FeatureList>
        <Feature
          img={"icons/features/development.svg"}
          title={"Development costs"}
          text={
            "It’s expensive to implement own complex in-app purchases tracking solution. At least, you need to hire iOS, Android developers, Backend and DevOps engineers.<br /> A team like this could worth $10,000+ per month."
          }
        />
        <Feature
          img={"icons/features/support.svg"}
          title={"Support costs "}
          text={
            "In-app purchases logic is really tricky. There are a lot of side cases so debugging and support could turn support into a nightmare. <br /> Apphud gives you reliable infrastructure with a 99.9% SLA rate for our SDK’s API."
          }
        />
        <Feature
          img={"icons/features/implementation.svg"}
          title={"Implementation speed"}
          text={
            "You may spend up to 6 months to develop in-house in-app purchases and subscriptions solution to production. <br /> This results in about 30,000 lines of code. And you need to be aware of all of the Apple and Google updates to keep your SDK's up-to-date."
          }
        />
        <Feature
          img={"icons/features/rules.svg"}
          title={"Rules and screens "}
          text={
            "Rules are seamless automation tool that helps to:<br /> – send Push notifications with discounts to win back lapsed customers;<br /> – receive user feedback;<br /> – ask customers to update payment info in case of billing issues."
          }
        />
        <Feature
          img={"icons/features/integrations.svg"}
          title={"Integrations"}
          text={
            "Apphud integrates with top analytics and marketing platforms including Amplitude, Mixpanel, Facebook, AppsFlyer, Branch, Adjust. <br /> Easily pass all subscription-based events and make data-driven product decisions."
          }
        />
        <Feature
          img={"icons/features/price.svg"}
          title={
            <>
              Price experiments
              <span className="soon" />
            </>
          }
          text={
            "Run A/B-experiments to find the optimal price that maximizes app revenue.<br /> Get insights and grow trial conversion and revenue. No coding required!"
          }
        />
      </FeatureList>

      <Description
        reverse
        title="Free for small teams and startups"
        description={
          "We are here to help growing your business.\n Apphud is Free unless your apps monthly tracked revenue is less than $10K."
        }
        img="inhouse2"
        alt="Free for small teams and startups"
      />

      <More
        title={"Need more details?"}
        text={
          <span>
            <a href="/pricing">View pricing</a>
          </span>
        }
      />

      <GetStarted />
    </div>
  );
}
