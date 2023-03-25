import Head from "next/head";
import Pricing from "components/sections/Pricing";
import Table from "components/sections/Table";
import Plan from "components/sections/Plan";
import Accordion from "components/sections/Accordion";
import More from "components/sections/More";
import GetStarted from "components/sections/GetStarted";
import Button from "components/UI/Button";
import Tooltip from "components/UI/Tooltip";
import useScrollTop from "../../hooks/useScrollTop";

const mockItems = [
  {
    id: "1",
    description: (
      <>
        <span>Monthly tracked revenue included</span>
        <Tooltip
          title={
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 0C4.48578 0 0 4.48578 0 10C0 15.5142 4.48578 20 10 20C15.5142 20 20 15.5142 20 10C20 4.48578 15.5142 0 10 0ZM10 15.8333C9.53995 15.8333 9.16672 15.4601 9.16672 15C9.16672 14.5399 9.53995 14.1667 10 14.1667C10.4601 14.1667 10.8333 14.5399 10.8333 15C10.8333 15.4601 10.4601 15.8333 10 15.8333ZM11.3191 10.535C11.0242 10.6708 10.8333 10.9683 10.8333 11.2926V11.6667C10.8333 12.1266 10.4608 12.5 10 12.5C9.53918 12.5 9.16672 12.1266 9.16672 11.6667V11.2926C9.16672 10.32 9.73831 9.42841 10.6209 9.02084C11.47 8.63007 12.0833 7.59247 12.0833 7.08328C12.0833 5.93506 11.1491 5 10 5C8.85086 5 7.91672 5.93506 7.91672 7.08328C7.91672 7.54333 7.5441 7.91672 7.08328 7.91672C6.62247 7.91672 6.25 7.54333 6.25 7.08328C6.25 5.01587 7.93243 3.33328 10 3.33328C12.0676 3.33328 13.75 5.01587 13.75 7.08328C13.75 8.20923 12.7733 9.8642 11.3191 10.535Z"
                fill="currentColor"
              />
            </svg>
          }
        >
          <div>
            Monthly Tracked Revenue is calculated across all apps. For each app,
            MTR is the revenue in USD reported to Apphud during one billing
            period before Apple cut. We count only real transactions, sandbox
            purchases are not counted.
          </div>
        </Tooltip>
      </>
    ),
    col1Text: "$10,000",
    col2Text: "$25,000",
    col3Text: "$100,000",
  },

  {
    id: "2",
    description: "Integrate and handle cross-platform in-app subscriptions",
    col1Check: "check",
    col2Check: "check",
    col3Check: "check",
  },

  {
    id: "3",
    description: "Validate App Store and Google Play receipts",
    col1Check: "check",
    col2Check: "check",
    col3Check: "check",
  },

  {
    id: "4",
    description: "Implement subscription offers with no server code",
    col1Check: "check",
    col2Check: "check",
    col3Check: "check",
  },

  {
    id: "5",
    description: "Revenue analytics",
    col1Check: "check",
    col2Check: "check",
    col3Check: "check",
  },

  {
    id: "6",
    description: "Detailed user page with transactions history",
    col1Check: "check",
    col2Check: "check",
    col3Check: "check",
  },

  {
    id: "7",
    description: "Integrations with 10+ external tools",
    col1Check: "check",
    col2Check: "check",
    col3Check: "check",
  },

  {
    id: "8",
    description: "Revenue analytics",
    col1Check: "check",
    col2Check: "check",
    col3Check: "check",
  },

  {
    id: "9",
    description: "Understand why customers cancel subscriptions",
    col1Check: "check",
    col2Check: "check",
    col3Check: "check",
  },

  {
    id: "10",
    description: "Server-to-server webhooks",
    col1Close: "close",
    col2Check: "check",
    col3Check: "check",
  },

  {
    id: "11",
    description: "Customers API",
    col1Close: "close",
    col2Check: "check",
    col3Check: "check",
  },

  {
    id: "12",
    description: "Raw data exports",
    col1Close: "close",
    col2Close: "close",
    col3Check: "check",
  },

  {
    id: "13",
    description: "Collaborators",
    col1Text: "1 collaborator",
    col2Text: "Unlimited",
    col3Text: "Unlimited",
  },

  {
    id: "14",
    description: "Run A/B experiments to test different in-app purchase prices",
    col1Text: "Soon",
    col2Text: "Soon",
    col3Text: "Soon",
  },
];

const mockTitles = [
  {
    id: "1",
    description: "",
  },

  {
    id: "2",
    description: "Free",
    subescription: "$0 / month",
  },

  {
    id: "3",
    description: "Launch",
    subescription: "$199 / month",
  },

  {
    id: "4",
    description: "Grow",
    subescription: "$499 / month",
  },
];

export default function pricing() {
  useScrollTop();

  return (
    <div className="wrapper">
      <Head>
        <title>Price - Apphud</title>
        <meta property="og:title" content="Price - Apphud" />
        <meta
          property="og:description"
          content="Good price: pay as you grow. Use Apphud for free if your revenue is less than $10,000 per month."
        />
        <meta property="og:url" content="https://apphud.com/pricing" />
        <meta property="og:image" content="/images/og/im_8.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_8.png" key="twitter:image" />
        <meta property="twitter:title" content="Price - Apphud" />
        <meta
          property="twitter:description"
          content="Good price: pay as you grow. Use Apphud for free if your revenue is less than $10,000 per month."
        />
        <meta property="twitter:url" content="https://apphud.com/pricing" />
        <meta
          name="description"
          content="Good price: pay as you grow. Use Apphud for free if your revenue is less than $10,000 per month."
        />
      </Head>

      <div className="title-block">
        <div className="container">
          <h1>Simple affordable pricing</h1>
          <p className="text_xl">
            Pay as your revenue grows. Start for free with no credit card
            required.
          </p>
        </div>
      </div>

      <Pricing />

      <Table titles={mockTitles} items={mockItems} col3>
        <span className="cell-hidden" />
        <a href="https://app.apphud.com/sign_up">
          <Button title="Get started" transparent border />
        </a>
        <a href="https://app.apphud.com/sign_up">
          <Button title="Choose plan" />
        </a>
        <a href="https://app.apphud.com/sign_up">
          <Button title="Choose plan" />
        </a>
      </Table>

      <Plan />
      <div className="accordion">
        <div className="container">
          <h2>Got a question?</h2>
          <div className="accordion-items">
            <Accordion title="What is MTR?">
              Monthly Tracked Revenue is calculated across all apps. For each
              app, MTR is the revenue in USD reported to Apphud during one
              billing period before Apple cut. We count only real transactions,
              sandbox purchases are not counted.
            </Accordion>
            <Accordion title="What if I go over MTR included to my plan?">
              We don't stop collecting data. Once you’ve run out of MTR included
              in your plan you will be charged our additional rate:
              <ul>
                <li>$7.99 per additional $1,000 MTR at Launch plan</li>
                <li>$5.99 per additional $1,000 MTR at Grow plan</li>
                <li>custom rate at Enterprise plan</li>
              </ul>
            </Accordion>
            <Accordion title="I’m on a Free plan. What if my MTR goes over $10,000?">
              We don't stop collecting data for the weekly grace period – for
              the next 7 days Apphud SDK will continue working.
              <br />
              <br /> After it, we'll continue to handle iAP purchases (but not
              user subscription state changes) and you won’t have access to the
              rest of features, including Integrations and Rules.
            </Accordion>
            <Accordion title="What’s the difference between paid plans?">
              Grow plan will be cheaper for you, If your MTR is high. There are
              several premium features available on paid plans only. View the
              list of them above.
            </Accordion>
            <Accordion title="Are all features included to all plans?">
              No. View the list of features available on paid plans only above.
            </Accordion>
            <Accordion title="Have more questions?">
              We are ready to help you! <a href="/contact">Contact us</a>
            </Accordion>
          </div>
        </div>
      </div>
      <GetStarted />
    </div>
  );
}
