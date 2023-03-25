import React from 'react';
import { Dashboard } from './Dashboard';

interface DefaultSuspenseProps {
  children: React.ReactNode;
}

export function DashboardSuspense(props: DefaultSuspenseProps) {
  const { children } = props;
  return (
    <Dashboard>
      <React.Suspense fallback={null}>{children}</React.Suspense>
    </Dashboard>
  );
}
