import React, { FC, memo, useState, useCallback, useMemo, useEffect } from 'react';
import SimpleReactLightbox from 'simple-react-lightbox';
import { Toolbar, useBreakpoints, useEventListener } from '@marketplace/ui-kit';
import { Header, HeaderProps } from 'containers/Header';
import { FlashMessage, NavigationLinks } from 'components';
import { FooterContainer } from 'containers/Footer';
import { MessageModalContainer } from 'containers/MessageModal';
import { CookieNotice } from 'components/CookieNotice/CookieNotice';
import { MenuVariants } from 'hooks/useMenuLinks';
import { useStyles } from './LandingLayout.styles';

const DefaultHeaderProp: HeaderProps = { transparent: false, position: 'fixed', elevation: 0 };
const DefaultMobileHeaderProp: HeaderProps = { transparent: true, position: 'absolute', elevation: 0 };
const ScrolledHeaderProp: HeaderProps = { transparent: false, position: 'fixed', elevation: 1 };
const navigationLinks: MenuVariants[] = ['VehiclesBuy', 'Instalment', 'Sell', 'Insurance'];
type LandingLayoutProps = {
  withoutFooter?: boolean;
  withNavigation?: boolean;
};

export const LandingLayout: FC<LandingLayoutProps> = memo(({ children, withoutFooter = false, withNavigation }) => {
  const { main } = useStyles();
  const { isMobile } = useBreakpoints();
  const [headerProps, setHeaderProps] = useState<HeaderProps>(DefaultHeaderProp);
  const windowElement = useMemo<Window | undefined>(() => (typeof window !== 'undefined' ? window : undefined), []);

  useEffect(() => {
    if (isMobile) {
      setHeaderProps(DefaultMobileHeaderProp);
    }
  }, [isMobile]);

  const handleScroll = useCallback(() => {
    const { innerHeight } = windowElement as Window;
    const isTransparent = headerProps.transparent;
    if (document.documentElement.scrollTop > innerHeight - 100) {
      if (isTransparent) {
        setHeaderProps(ScrolledHeaderProp);
      }
    } else if (!isTransparent) {
      if (isMobile) {
        setHeaderProps(DefaultMobileHeaderProp);
      } else {
        setHeaderProps(DefaultHeaderProp);
      }
    }
  }, [headerProps, windowElement]);

  useEventListener('scroll', handleScroll, windowElement as Window);
  return (
    <>
      <main className={main}>
        <Header {...headerProps} />
        {!isMobile && <Toolbar />}
        {withNavigation && <NavigationLinks links={navigationLinks} />}
        <FlashMessage />
        <SimpleReactLightbox>{children}</SimpleReactLightbox>
        <FooterContainer isVisible={!withoutFooter} />
      </main>
      <MessageModalContainer />
      <CookieNotice />
    </>
  );
});
