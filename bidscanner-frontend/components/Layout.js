// @flow

// sample layout
import type { Element } from 'react';
import Header from 'containers/header/HeaderContainer';
import Footer from 'components/footer/Footer';
import styled from 'styled-components';
import Helmet from 'react-helmet';

type Props = {
  children?: Element<any>,
  title?: string,
  verticalCenter?: boolean,
  contentOnly?: boolean,
  showText?: boolean,
  showSearch?: boolean,
  showServices?: boolean,
};

const Body = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`;

const Content = styled.div`flex: 1;`;

export default ({
  children,
  verticalCenter,
  contentOnly = false,
  showText = false,
  showSearch = false,
  showServices = false,

  title = 'This is the default title',
  description,
  keywords,
}: Props) => (
  <div>
    <Helmet>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
    </Helmet>
    <Body>
      {!contentOnly && <Header showText={showText} showSearch={showSearch} showServices={showServices} />}
      <Content className={verticalCenter && 'd-flex flex-column justify-content-center'}>{children}</Content>
      {!contentOnly && <Footer />}
    </Body>
  </div>
);
