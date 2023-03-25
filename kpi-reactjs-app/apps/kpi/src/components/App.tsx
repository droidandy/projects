import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { useGlobalModule } from 'src/features/global/module';
import { useReferencesModule } from 'src/features/references/module';
import { useRouterModule } from 'src/features/router';
import { getGlobalState } from 'src/features/global/interface';
import { RouteResolver } from './RouteResolver';
import { Notifications } from './Notifications';
import { useReferencesNextModule } from 'src/features/referencesNext/module';

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  html, body {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
    -webkit-overflow-scrolling: auto;
    height: 100%;
    margin: 0px;
    padding: 0px;
    font-size: 13px;
    color: #646c9a;
    background-color: #fff;
    line-height: 1.5;
    direction: ${(props: { direction: string }) => props.direction}
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
  body {
    background: #f2f3f8;
  }

  @media (min-width: 1025px) {
    body.kt-header--minimize {
      padding-top: 80px;
    }
  }

  a {
    color: #5d78ff;
    cursor: pointer;
    text-decoration: none;
  }
`;

export function App() {
  useRouterModule();
  useGlobalModule();
  useReferencesModule();
  useReferencesNextModule();

  const {
    isLoaded,
    language,
    user,
    strategicPlans,
    colorThemes,
    currentThemeId,
  } = getGlobalState.useState();
  React.useEffect(() => {
    document.body.classList.remove('rtl');
    if (language === 'ar') {
      document.body.classList.add('rtl');
    }
  }, [language]);

  React.useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onScroll = () => {
    if (window.scrollY >= 250 && window.innerWidth >= 1025) {
      document.body.classList.add('kt-header--minimize');
    } else {
      if (document.body.classList.contains('kt-header--minimize')) {
        document.body.classList.remove('kt-header--minimize');
      }
    }
  };

  const isDataLoaded = user ? strategicPlans != null : true;
  const theme = React.useMemo(() => {
    const ret = colorThemes.find(x => x.id === currentThemeId);
    return ret ? ret.vars : {};
  }, [colorThemes, currentThemeId]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <>
          {isLoaded && isDataLoaded && <RouteResolver />}
          <GlobalStyle direction={language === 'ar' ? 'rtl' : 'ltr'} />
          <Notifications />
        </>
      </ThemeProvider>
    </>
  );
}
