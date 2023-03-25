import React, { FC } from 'react';
import { Header } from 'containers/Header';
import { MainLayout } from 'layouts/MainLayoutNew';
import { Toolbar, Box } from '@marketplace/ui-kit';

export const ProfileRootPageLayout: FC = ({ children }) => {
  return (
    <MainLayout>
      <Header position="fixed" elevation={1} />
      <Toolbar />
      <Box style={{ minHeight: 'calc(100vh - 362px)' }}>{children}</Box>
    </MainLayout>
  );
};
