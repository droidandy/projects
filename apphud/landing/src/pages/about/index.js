import Head from "next/head";
import AboutHeader from "components/sections/AboutHeader";
import Team from "components/sections/Team";
import useScrollTop from "../../hooks/useScrollTop";

export default function about() {
  useScrollTop();

  return (
    <div className="wrapper">
      <Head>
        <title>About us – Apphud</title>
        <meta property="og:title" content="About us – Apphud" />
        <meta
          property="og:description"
          content="Who we are – meet the Apphud team."
        />
        <meta property="og:url" content="https://apphud.com/about" />
        <meta property="og:image" content="/images/og/im_2.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_2.png" key="twitter:image" />
        <meta property="twitter:title" content="About us – Apphud" />
        <meta
          property="twitter:description"
          content="Who we are – meet the Apphud team."
        />
        <meta property="twitter:url" content="https://apphud.com/about" />
        <meta name="description" content="Who we are – meet the Apphud team." />
      </Head>

      <AboutHeader
        title={"Who we are"}
        text={`We are a global remote team making a software used by hundreds of apps worldwide. Our mission is to help mobile-first companies grow their business.`}
        img={"/images/about-title.svg"}
      />

      <Team />
    </div>
  );
}
