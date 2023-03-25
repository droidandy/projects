import Head from "next/head";
import GetStarted from "components/sections/GetStarted";
import TitleBlock from "components/sections/TitleBlock";
import ContactLinks from "components/sections/ContactLinks";
import useScrollTop from "../../hooks/useScrollTop";

const items = [
  {
    id: "1",
    img: "chat.svg",
    text: <span className="open-chat">Chat with us</span>,
    status: true,
  },

  {
    id: "2",
    img: "email.svg",
    text: "Email to us",
    status: false,
    link: "mailto:support@apphud.com?subject=Apphud support&body=",
  },

  {
    id: "3",
    img: "docs.svg",
    text: "Read the docs",
    status: false,
    link: "https://docs.apphud.com",
  },
];

const Contact = () => {
  useScrollTop();

  return (
    <div className="wrapper">
      <Head>
        <title>Contact - Apphud</title>
        <meta property="og:title" content="Contact - Apphud" />
        <meta
          property="og:description"
          content="Apphud contact information. Contact support via email or chat with us."
        />
        <meta property="og:url" content="https://apphud.com/contact" />
        <meta property="og:image" content="/images/og/im_7.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_7.png" key="twitter:image" />
        <meta property="twitter:title" content="Contact - Apphud" />
        <meta
          property="twitter:description"
          content="Apphud contact information. Contact support via email or chat with us."
        />
        <meta property="twitter:url" content="https://apphud.com/contact" />
        <meta
          name="description"
          content="Apphud contact information. Contact support via email or chat with us."
        />
      </Head>

      <TitleBlock
        title={"Any questions?"}
        subtitle={"We are ready to help you."}
      />

      <ContactLinks items={items} />

      <GetStarted />
    </div>
  );
};

export default Contact;
