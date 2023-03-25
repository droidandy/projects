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
        <title>Analyze Apple Search Ads campaigns – Apphud</title>
        <meta
          property="og:title"
          content="Analyze Apple Search Ads campaigns – Apphud"
        />
        <meta
          property="og:description"
          content="View key metrics of your app filtered and segmented by different Apple Search Ads campaigns."
        />
        <meta property="og:url" content="https://apphud.com/apple-search-ads" />
          <meta property="og:image" content="/images/og/im_17.png" key="og:image" />
          <meta property="twitter:image" content="/images/og/im_17.png" key="twitter:image" />
        <meta
          property="twitter:title"
          content="Analyze Apple Search Ads campaigns – Apphud"
        />
        <meta
          property="twitter:description"
          content="View key metrics of your app filtered and segmented by different Apple Search Ads campaigns."
        />
        <meta
          property="twitter:url"
          content="https://apphud.com/apple-search-ads"
        />
        <meta
          name="description"
          content="View key metrics of your app filtered and segmented by different Apple Search Ads campaigns."
        />
      </Head>

      <TitleProduct
        icon={"/icons/integrations/apple.svg"}
        title={"Analyze Apple Search\n Ads campaigns"}
        text={
          "View key metrics of your app filtered and segmented by different Apple Search Ads campaigns."
        }
        actions={
          <a href="https://app.apphud.com/sign_up">
            <Button title="Start for Free" />
          </a>
        }
      />

      <Description
        title={"Analyze ad campaigns"}
        description="View app revenue, MRR, conversions, churn rate and other metrics segmented by your Apple Search Ads campaigns."
        img="apple1"
        alt="Analyze ad campaigns"
      />

      <More
        title={"Have more questions?"}
        text={
          <span>
            Read the{" "}
            <a href="https://docs.apphud.com/integrations/attribution/apple-search-ads">
              documentation
            </a>
          </span>
        }
      />

      <GetStarted />
    </div>
  );
}
