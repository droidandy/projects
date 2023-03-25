import React from 'react';
import cx from 'classnames';
import { Grid, Img, Typography } from '@marketplace/ui-kit';
import { Office } from '@marketplace/ui-kit/types';
import { useStyles } from './PartnerBlock.styles';

type PartnerBlockProps = {
  office: Office;
  brandName: string;
  className?: string;
  isNew?: boolean;
};

export const PartnerBlock = ({
  office: {
    company: { logo, name },
    address,
  },
  isNew,
  brandName,
  className,
}: PartnerBlockProps) => {
  const s = useStyles();

  return (
    <Grid item>
      <div className={cx(className, s.dealer)}>
        <div className={s.dealerLogoWrapper}>
          {logo ? (
            <Img src={logo} alt={name} />
          ) : (
            <Typography variant="body1" align="center" gutterBottom>
              {name}
            </Typography>
          )}
        </div>
        <Typography variant="h5" align="center" gutterBottom>
          Официальный дилер {isNew && brandName}
        </Typography>
        <Typography variant="body2" align="center" className={s.dealerAddress}>
          {address}
        </Typography>
      </div>
    </Grid>
  );
};
