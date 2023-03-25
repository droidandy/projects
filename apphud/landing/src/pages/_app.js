import React, {Fragment, useEffect} from "react";
import { useRouter } from "next/router";
import Header from "components/Header";
import Footer from "components/Footer";
import "../styles/globals.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TagManager from "react-gtm-module";
import Notification from "../components/UI/Notification";
import useCookieUsage from "../hooks/useCookieUsage";

const tagManagerArgs = {
  gtmId: "GTM-58QHBBJ",
  dataLayer: [{}],
};

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [useCookies, setUseCookies] = useCookieUsage();
  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, [router]);

  return (
    <div>
        <Notification
            show={true}
            text={
                <Fragment>
                    <span>We're hiring 😎</span>
                    <a rel="nofollow" href="https://career.habr.com/companies/apphud/vacancies" target="_blank">Learn more</a>
                </Fragment>
            }
        />
        <Header />
        <Component {...pageProps} />
        <Footer />
    </div>
  );
}

export default MyApp;
