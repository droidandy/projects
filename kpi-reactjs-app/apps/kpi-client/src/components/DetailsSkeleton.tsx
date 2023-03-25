import React from 'react';
import Skeleton from 'react-skeleton-loader';

export function DetailsSkeleton() {
  return <Skeleton height={'13px'} count={5} width="50%" />;
}
