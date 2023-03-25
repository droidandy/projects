import React, { FC, useCallback, useMemo, useState } from 'react';
import { Header, HeaderProps } from 'containers/Header';
import { MainLayout } from 'layouts/MainLayoutNew';
import { Toolbar, Box } from '@material-ui/core';
import { useBreakpoints, useEventListener } from '@marketplace/ui-kit/hooks';

const DefaultHeaderProp: HeaderProps = { transparent: true, position: 'absolute', elevation: 0 };
const ScrolledHeaderProp: HeaderProps = { position: 'fixed', elevation: 1 };

export const LandingPageLayout: FC = ({ children }) => {
  const { isMobile } = useBreakpoints();
  const [headerProps, setHeaderProps] = useState<HeaderProps>(DefaultHeaderProp);
  const windowElement = useMemo<Window | undefined>(() => (typeof window !== 'undefined' ? window : undefined), []);

  const handleScroll = useCallback(() => {
    const { innerHeight } = windowElement as Window;
    const isTransparent = headerProps.transparent;
    if (document.documentElement.scrollTop > innerHeight - 100) {
      if (isTransparent) {
        setHeaderProps(ScrolledHeaderProp);
      }
    } else if (!isTransparent) {
      setHeaderProps(DefaultHeaderProp);
    }
  }, [headerProps, windowElement]);

  useEventListener('scroll', handleScroll, windowElement as Window);

  return (
    <MainLayout>
      <Header {...(!isMobile ? ScrolledHeaderProp : headerProps)} />
      {!isMobile && <Toolbar />}
      <Box style={{ minHeight: 'calc(100vh - 362px)' }}>{children}</Box>
    </MainLayout>
  );
};
