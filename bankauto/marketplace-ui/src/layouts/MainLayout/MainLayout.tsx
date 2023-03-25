import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import SimpleReactLightbox from 'simple-react-lightbox';
import { useEventListener } from '@marketplace/ui-kit';
import { FooterContainer } from 'containers/Footer';
import { Header } from 'containers/Header';
import { FlashMessage } from 'components';
import { usePageContext } from 'helpers/context/PageContext';
import { useSsrMatchMedia } from 'hooks/useSsrMatchMedia';
import { MessageModalContainer } from 'containers/MessageModal';
import { CookieNotice } from 'components/CookieNotice/CookieNotice';
import { useStyles } from './MainLayout.styles';

export const MainLayout: FC = memo(({ children }) => {
  const { isMobileDevice } = usePageContext();
  const ssrMatchMedia = useSsrMatchMedia(isMobileDevice);
  const { main } = useStyles();
  const [scroll, setScroll] = useState(false);
  const windowElement = useMemo<Window | undefined>(() => (typeof window !== 'undefined' ? window : undefined), []);
  const handleScroll = useCallback(() => {
    if (document.documentElement.scrollTop > 1) {
      setScroll(true);
    }
  }, []);

  useEventListener('scroll', handleScroll, windowElement as Window);
  return (
    <>
      <main className={main}>
        <Header position="fixed" elevation={scroll ? 4 : 0} transparent />
        <FlashMessage />
        <SimpleReactLightbox>{children}</SimpleReactLightbox>

        <FooterContainer />
      </main>
      <MessageModalContainer />
      <CookieNotice />
    </>
  );
});
