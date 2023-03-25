import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { useGlobalModule } from 'src/features/global/module';
import { useRouterModule } from 'src/features/router';
import { getGlobalState } from 'src/features/global/interface';
import { RouteResolver } from './RouteResolver';
import { Notifications } from './Notifications';
import { ScrollTop } from './ScrollTop';

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  @font-face {
  font-family: "arabic-font";
  src: url("${require('../../assets/fonts/NotoKufiArabic-Regular.ttf')}");
  font-weight: normal;
  font-style: normal; }

  html, body, input, textarea {
    font-family: 'arabic-font', 'Muli', 'Poppins', 'Helvetica', sans-serif; 
  }

  html, body {
    -webkit-overflow-scrolling: auto;
    height: 100%;
    margin: 0px;
    padding: 0px;
    font-size: 13px;
    color: #646c9a;
    background: #f9f9fc;
    line-height: 1.5;
    direction: ${(props: { direction: string }) => props.direction};
    -webkit-font-smoothing: antialiased;
  }
 
  @media (min-width: 769px) and (max-width: 1024px) {
    html,
    body {
      font-size: 12px;
    }
  }

  @media (max-width: 768px) {
    html,
    body {
      font-size: 12px;
    }
  }
  @media (min-width: 1025px) {
    body.kt-header--minimize {
      padding-top: 110px;
    }
  }

  a {
    color: #5d78ff;
    cursor: pointer;
    text-decoration: none;
  }

  h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-weight: 500;
    line-height: 1.2;
  }
  h5, .h5 {
    font-size: 1.25rem;
  }
`;

export function App() {
  useRouterModule();
  useGlobalModule();

  const { isLoaded, user, dashboards } = getGlobalState.useState();
  const language = 'ar';

  React.useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onScroll = () => {
    if (window.scrollY > 210 && window.innerWidth >= 1025) {
      document.body.classList.add('kt-header--minimize');
    } else if (window.scrollY < 200) {
      if (document.body.classList.contains('kt-header--minimize')) {
        document.body.classList.remove('kt-header--minimize');
      }
    }
  };

  React.useEffect(() => {
    document.body.classList.remove('rtl');
    if (language === 'ar') {
      document.body.classList.add('rtl');
    }
  }, [language]);
  const isDataLoaded = user ? dashboards != null : true;

  return (
    <>
      <>
        {isLoaded && isDataLoaded && <RouteResolver />}
        <GlobalStyle direction={language === 'ar' ? 'rtl' : 'ltr'} />
        <Notifications />
        <ScrollTop />
      </>
    </>
  );
}
