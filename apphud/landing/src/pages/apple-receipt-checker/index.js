import React from "react";
import Main from "components/sections/Main";
import AppChecker from "../../components/sections/AppleReceiptChecker";
import Accordion from "../../components/sections/Accordion";
import {AnimationChecker} from "components/Animation";
import Head from "next/head";

const content = {
  content: <AnimationChecker />,
  title: <span>Apple<br/>Receipt<br/>Checker</span>,
  description: 'Apple receipt checker is a simple convenient tool to debug in-app purchases/subscriptions in your app. Grab Base 64 encoded receipt data, the app’s shared secret, and get JSON-formatted receipt data.'
};

export default function AppleReceiptChecker() {
  const endpoint = (data) => {
    if (!data?.storeKit) {
      return fetch("/api/verify-receipt", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }else {
      return fetch(`https://api.appfist.com/verify_receipt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: data?.data}),
      });
    }
  }

  return (
    <div className="wrapper">
      <Head>
        <title>Apple Receipt Checker - Apphud</title>
        <meta property="og:title" content="Apple Receipt Checker - Apphud" />
      </Head>
      <Main {...content} absolute mainLong />
      <div className="container">
        <AppChecker endpoint={endpoint} />
        <div className="accordion">
          <div className="container">
            <h2>Got a question?</h2>
            <div className="accordion-items">
              <Accordion title="Why should I use receipt checker?">
                It’s a simple and convenient tool to debug in-app purchases/subscriptions in your app. No more headache with command-line, curl, and other stuff like that.
                <br/><br/>
                Save your time – just grab Base 64 encoded receipt data and the app’s shared secret. That’s it! Get JSON-formatted receipt data.
              </Accordion>
              <Accordion title="How does it work?">
                We check the receipt status sending it to Apple via a proxy server.
              </Accordion>
              <Accordion title="What these status codes mean?">
                Here’s some explanation.
                <br/><br/>
                <b>21000</b> – The App Store could not read the JSON object you provided.<br/>
                <b>21002</b> – The data in the receipt-data property was malformed or missing.<br/>
                <b>21003</b> – The receipt could not be authenticated.<br/>
                <b>21004</b> – The shared secret you provided does not match the shared secret on file for your account.<br/>
                <b>21005</b> – The receipt server is not currently available.<br/>
                <b>21006</b> – This receipt is valid but the subscription has expired. When this status code is returned to your server, the receipt data is also decoded
                and returned as part of the response. Only returned for iOS 6 style transaction receipts for auto-renewable subscriptions.<br/>
                <b>21007</b> – This receipt is from the test environment, but it was sent to the production environment for verification. Send it to the test environment instead.<br/>
                <b>21008</b> – This receipt is from the production environment, but it was sent to the test environment for verification. Send it to the production environment instead.<br/>
                <b>21010</b> – This receipt could not be authorized. Treat this the same as if a purchase was never made.<br/>
                <b>21100-21199</b> - Internal data access error.<br/>
              </Accordion>
              <Accordion title="What about my data? Is it safe?">
                Don’t worry – it’s impossible to cancel or change a purchase with the receipt. Having the shared secret, the only thing you can do is to query a receipt status.
                <br/><br/>
                Also, we don’t store any of your receipts. We only proxying requests and return a response. Nothing more.
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
