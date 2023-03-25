import React, { FC, useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Header } from 'containers/Header';
import { useRouter } from 'next/router';
import { MainLayout } from 'layouts/MainLayoutNew';
import { Box, Toolbar, useBreakpoints, useEventListener } from '@marketplace/ui-kit';
import { NavigationLinks } from 'components';
import { MenuVariants } from 'hooks/useMenuLinks';
import { logout } from 'store/user';

const navigationLinks: MenuVariants[] = [
  'Applications',
  'Offers',
  'Remont',
  'Policies',
  'PersonalInfo',
  'Favorites',
  'Reviews',
  'Comparison',
  'Sell',
  'Inspections',
];

const PersonalAreaLayout: FC = ({ children }) => {
  const dispatch = useDispatch();
  const { isMobile } = useBreakpoints();
  const router = useRouter();
  const [scroll, setScroll] = useState(false);
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

  const handleLogout = useCallback(() => {
    dispatch(logout());
    router.push('/');
  }, []);

  return (
    <MainLayout>
      <Header position="fixed" elevation={scroll ? 1 : 0} />
      <Toolbar />
      {!isMobile && <NavigationLinks shallow links={navigationLinks} onLogoutClick={handleLogout} />}
      <Box style={{ minHeight: 'calc(100vh - 362px)' }}>{children}</Box>
    </MainLayout>
  );
};

export { PersonalAreaLayout };
