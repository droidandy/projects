import React, { FC, memo } from 'react';
import SimpleReactLightbox from 'simple-react-lightbox';
import { FlashMessage } from 'components/FlashMessage';
import { FooterContainer } from 'containers/Footer';
import { MessageModalContainer } from 'containers/MessageModal';
import { CookieNotice } from 'components/CookieNotice/CookieNotice';
import { useStyles } from './MainLayout.styles';

export const MainLayout: FC = memo(({ children }) => {
  const { main } = useStyles();

  return (
    <>
      <main className={main}>
        <FlashMessage />
        <SimpleReactLightbox>{children}</SimpleReactLightbox>
        <FooterContainer />
      </main>
      <MessageModalContainer />
      <CookieNotice />
    </>
  );
});
