import Head from "next/head";
import SC from 'styled-components';

const Content = SC.div`
  color: #000;
  background: #fff;
  height: 100vh;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Iframe = SC.iframe`
  border: none;
  
`;

export default function objects() {
  return (
    <>
      <Head>
        <title>Объекты</title>
        <meta property="og:title" content="Объекты" />
        <meta property="og:description" content="Объекты" />
        <meta property="og:url" content="https://site.com/about" />
        <meta property="og:image" content="/images/og/im_2.png" key="og:image" />
        <meta property="twitter:image" content="/images/og/im_2.png" key="twitter:image" />
        <meta property="twitter:title" content="Объекты" />
        <meta property="twitter:description" content="Объекты" />
        <meta property="twitter:url" content="https://site.com/about" />
        <meta name="description" content="Объекты" />
      </Head>
      <Content>
        <Iframe src="https://dodimpro.ru/" width="100%" height="100%" align="left">
          Ваш браузер не поддерживает плавающие фреймы!
        </Iframe>
      </Content>
    </>
  );
}
