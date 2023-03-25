import React, { FC, useCallback, useMemo, useState } from 'react';
import { Header } from 'containers/Header';
import { MainLayout } from 'layouts/MainLayoutNew';
import { Toolbar, useBreakpoints, useEventListener } from '@marketplace/ui-kit';
import { NavigationLinks } from 'components';
import { MenuVariants } from 'hooks/useMenuLinks';

const navigationLinks: MenuVariants[] = ['FinanceDebitCard', 'FinanceDeposit', 'FinanceSavingsAccount'];

const FinanceLayout: FC = ({ children }) => {
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
      {children}
    </MainLayout>
  );
};

export { FinanceLayout };
