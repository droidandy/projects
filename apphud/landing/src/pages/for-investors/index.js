import InvestorsContact from "components/sections/InvestorsContact";
import InvestorsTitle from "components/sections/InvestorsTitle";
import More from "components/sections/More";
import Head from "next/head";
import useScrollTop from "../../hooks/useScrollTop";

export default function investors() {
  useScrollTop();

  return (
    <div className="wrapper">
      <Head>
        <title>We are open for a partnership</title>
        <meta property="og:title" content="We are open for a partnership" />
        <meta
          property="og:description"
          content="Subscription management platform for mobile apps."
        />
        <meta property="og:url" content="https://apphud.com/for-investors" />
          <meta property="og:image" content="/images/og/im_9.png" key="og:image" />
          <meta property="twitter:image" content="/images/og/im_9.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="We are open for a partnership"
        />
        <meta
          property="twitter:description"
          content="Subscription management platform for mobile apps."
        />
        <meta
          property="twitter:url"
          content="https://apphud.com/for-investors"
        />
        <meta
          name="description"
          content="Subscription management platform for mobile apps."
        />
      </Head>

      <InvestorsTitle
        title={"Subscription management platform for mobile apps"}
        text={
          "Apphud is a subscription management platform for cross-platform mobile apps.\n\n Apphud is a toolkit to implement subscriptions in mobile app in a few lines of code with no back-end required.\n\n It's also deep subscription analytics tool that lets you make data-driven decisions. Apphud integrates with 3rd-party analytics and marketing tools: Amplitude, Mixpanel, AppsFlyer, Branch, Adjust and many more.\n\n Additionally, Apphud can increase app revenue by sending automated discounts for lapsed customers. Using Apphud, learn why customers cancel trials and subscriptions, fix failed renewals by sending Push notifications and in-app reminders to update billing info."
        }
      />

      <InvestorsContact />
    </div>
  );
}
