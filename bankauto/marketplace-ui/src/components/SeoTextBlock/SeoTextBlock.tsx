import React from 'react';
import { useVehiclesMeta } from 'store/catalog/vehicles/meta';
import { Box } from '@marketplace/ui-kit';
import { useStyles } from './SeoTextBlock.styles';

export const SeoTextBlock = () => {
  const { root } = useStyles();
  const {
    meta: { seoText },
  } = useVehiclesMeta();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  return <Box dangerouslySetInnerHTML={{ __html: seoText! }} className={root} />;
};
