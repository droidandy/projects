import Head from "next/head";
import Main from "components/sections/Main";
import Brands from "components/sections/Brands";
import UsedList from "components/sections/UsedList";
import Infrastructure from "components/sections/Infrastructure";
import ForDevelopmentTeams from "components/sections/ForDevelopmentTeams";
import ForMarketingTeams from "components/sections/ForMarketingTeams";
import ForProductTeams from "components/sections/ForProductTeams";
import Testimonials from "components/sections/Testimonials";
import BuildProduct from "components/sections/BuildProduct";
import GetStarted from "components/sections/GetStarted";
import Notification from "components/UI/Notification";

const content = {
  title: 'In-app subscriptions infrastructure you can rely on',
  description: 'Apphud provides a smarter way to build and grow mobile apps with in-app subscriptions. By making development simpler, providing real-time data and tools to increase revenue.'
};

export default function Home() {
  return (
    <div className="wrapper">
      <Head>
        <title>More than analytics for iOS and Android in-app subscriptions – Apphud</title>
        <meta property="og:title" content="Mobile app analytics tool for iOS and Android in app subscriptions – Apphud" />
        <meta
          property="og:description"
          content="Apphud is a platform to build, measure and improve iOS and Android auto-renewable subscriptions. Start using mobile app analytics tool for free today."
        />
        <meta property="og:url" content="https://apphud.com" />
        <meta property="og:image" content="/images/og/im_1.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_1.png" key="twitter:image" />
        <meta property="twitter:title" content="Mobile app analytics tool for iOS and Android in app subscriptions – Apphud" />
        <meta
          property="twitter:description"
          content="Apphud is a platform to build, measure and improve iOS and Android auto-renewable subscriptions. Start using mobile app analytics tool for free today."
        />
        <meta property="twitter:url" content="https://apphud.com" />
        <meta name="twitter:domain" content="apphud.com"/>
        <meta
          name="description"
          content="Apphud is a platform to build, measure and improve iOS and Android auto-renewable subscriptions. Start using mobile app analytics tool for free today."
        />
      </Head>

      <Main {...content} absolute mainLong withBtns />
      <Brands />
      {/* <UsedList /> */}
      <Infrastructure />
      <ForDevelopmentTeams />
      <ForMarketingTeams />
      <ForProductTeams />
      {/* <Testimonials /> */}
      <BuildProduct />
      <GetStarted />
    </div>
  );
}
