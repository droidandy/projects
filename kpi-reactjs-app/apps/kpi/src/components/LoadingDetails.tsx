import React from 'react';
import { Portlet } from './Portlet';
import { DetailsSkeleton } from './DetailsSkeleton';

export function LoadingDetails() {
  return (
    <Portlet padding>
      <div>
        <DetailsSkeleton />
      </div>
    </Portlet>
  );
}
