import Head from "next/head";
import Main from "components/sections/Main";
import Description from "components/sections/Description";
import ReliabilityApp from "components/sections/ReliabilityApp";
import Table from "components/sections/Table";
import GetStarted from "components/sections/GetStarted";
import useScrollTop from "../../hooks/useScrollTop";
import {AnimationMakingInApp} from "../../components/Animation";

const Collection = [
  { id: "1", img: "ic1" },
  { id: "4", img: "ic4" },
  { id: "7", img: "ic7" },
  { id: "2", img: "ic2" },
  { id: "8", img: "ic8" },
  { id: "11", img: "ic11" },
  { id: "3", img: "ic3" },
  { id: "5", img: "ic5" },
  { id: "6", img: "ic6" },
];

const titles = [
  {
    id: "1",
    description: "",
  },

  {
    id: "2",
    description: "Apphud",
  },

  {
    id: "3",
    description: "Apple StoreKit / Google Play Billing Library",
  },
];

const items = [
  {
    id: "1",
    description: "Easy integration",
    col1Check: "check",
    col2Check: "close",
  },

  {
    id: "2",
    description: "Works both for iOS and Android apps",
    col1Check: "check",
    col2Check: "close",
  },

  {
    id: "3",
    description: "Real-time analytics",
    col1Check: "check",
    col2Check: "close",
  },

  {
    id: "4",
    description: "Automatic server-side receipt validation",
    col1Check: "check",
    col2Check: "close",
  },

  {
    id: "5",
    description: "Get user subscription state in a real time",
    col1Check: "check",
    col2Check: "close",
  },

  {
    id: "6",
    description: "View customer transaction history",
    col1Check: "check",
    col2Check: "close",
  },

  {
    id: "7",
    description: "Send events to third-party tools",
    col1Check: "check",
    col2Check: "close",
  },

  {
    id: "8",
    description: "Server-to-server webhooks",
    col1Check: "check",
    col2Text: "Limited",
  },

  {
    id: "9",
    description: "Friendly technical support",
    col1Check: "check",
    col2Check: "close",
  },
];

export default function whyApphud() {
  useScrollTop();

  return (
    <div className="wrapper">
      <Head>
        <link rel="icon" href="/favicon.ico" />

        <title>Why to use Apphud as in-app subscriptions infrastructure?</title>
        <meta
          property="og:title"
          content="Use Apphud platform as in app subscriptions infrastructure – Apphud"
        />
        <meta
          property="og:description"
          content="App platform Apphud making in app subscriptions simple. Rely on the best-in-class in app purchase solution stack."
        />
        <meta property="og:url" content="https://apphud.com/why-apphud" />
        <meta property="og:image" content="/images/og/im_27.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_27.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Use Apphud platform as in app subscriptions infrastructure – Apphud"
        />
        <meta
          property="twitter:description"
          content="App platform Apphud making in app subscriptions simple. Rely on the best-in-class in app purchase solution stack."
        />
        <meta property="twitter:url" content="https://apphud.com/why-apphud" />
        <meta
          name="description"
          content="App platform Apphud making in app subscriptions simple. Rely on the best-in-class in app purchase solution stack."
        ></meta>
      </Head>

      <Main
        title="Why to use Apphud as in-app subscriptions infrastructure?"
        long
        description="Rely on the best-in-class in-app purchase solution stack. Focus on your product, not on building in-app subscriptions infrastructure."
        absolute
      />
      <Description
        title="Making in-app subscriptions simple as a pie"
        description="Mobile-first companies may spend hundreds of hours on building their own solution to support mobile in-app subscriptions. Apphud reduces this time from months to minutes. No need to write server-side code."
        linkPath="/development"
        linkText="Learn about Apphud for development"
        img={(
            <AnimationMakingInApp />
        )}
        alt="making-in-app"
      />
      <Description
        reverse
        title="Complete mobile in-app purchases stack with no extra costs"
        description="Don’t waste time and money on building your own in-app purchases infrastructure. Use Apphud for free until your app revenue increases $10,000 per month."
        linkPath="/pricing"
        linkText="View pricing"
        img="mobile-in-app"
        alt="mobile-in-app"
      />
      {/* <ReliabilityApp /> */}
      <Description
        title="Focused on data accuracy"
        description="Apphud provides the highest accuracy on app revenue tracking. Analyze all important app metrics with a confidence."
        linkPath="/marketing"
        linkText="Learn about Apphud for marketing"
        img="data-accuracy"
        alt="data-accuracy"
      />
      {/* <Description
        reverse
        title="Trusted by hundreds of mobile apps worldwide"
        description="From small apps earning a few thousands per month to a leading mobile-focused companies."
        linkPath="/development"
        linkText="Learn about Apphud for development"
        collection={Collection}
        alt="mobile-apps-worldwide"
      /> */}
      <Description
        title="Retain users and grow revenue"
        description={
          "Automatically send push notifications with discounts to win back lapsed customers, receive user feedback and ask customers to update payment info in case of billing issue. No coding required.\n\n Run experiments on your paywalls to find a better price. A/B-tests will be available soon."
        }
        linkPath="/product"
        linkText="Learn about Apphud for product"
        img="retain-users"
        alt="retain-users"
      />
      <Table titles={titles} items={items} />
      <GetStarted />
    </div>
  );
}
