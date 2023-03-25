import React, { FC, useCallback, useMemo, useState, CSSProperties } from 'react';
import { Box, Toolbar } from '@material-ui/core';
import { useBreakpoints, useEventListener } from '@marketplace/ui-kit/hooks';
import { MenuVariants } from 'hooks/useMenuLinks';
import { FEATURE_INSTALLMENT_ON } from 'constants/featureFlags';
import { MainLayout } from 'layouts/MainLayoutNew';
import { Header } from 'containers/Header';
import { NavigationLinks } from 'components/NavigationLinks';

const navigationLinks: MenuVariants[] = [
  'VehiclesBuy',
  ...(FEATURE_INSTALLMENT_ON ? ['Instalment' as MenuVariants] : []),
  'SellCreate',
  'Insurance',
];

const CatalogLayout: FC<{ styles?: CSSProperties }> = ({ styles = {}, children }) => {
  const [scroll, setScroll] = useState(false);
  const { isMobile } = useBreakpoints();
  const windowElement = useMemo<Window | undefined>(() => (typeof window !== 'undefined' ? window : undefined), []);

  const handleScroll = useCallback(() => {
    if (document.documentElement.scrollTop > 1) {
      if (!scroll) {
        setScroll(true);
      }
    } else if (scroll) {
      setScroll(false);
    }
  }, [scroll]);

  useEventListener('scroll', handleScroll, windowElement as Window);

  return (
    <MainLayout>
      <Header position="fixed" elevation={scroll ? 1 : 0} />
      <Toolbar />
      {!isMobile && <NavigationLinks links={navigationLinks} />}
      <Box style={{ minHeight: 'calc(100vh - 362px)', ...styles }}>{children}</Box>
    </MainLayout>
  );
};

export { CatalogLayout };
