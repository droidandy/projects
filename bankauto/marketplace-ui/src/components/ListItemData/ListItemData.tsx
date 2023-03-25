import React, { FC, useMemo } from 'react';
import { Typography, Grid, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as IconCalendar } from '@marketplace/ui-kit/icons/icon-calendar.svg';
import { ReactComponent as IconWallet } from '@marketplace/ui-kit/icons/icon-wallet.svg';
import { ReactComponent as IconPercent } from 'icons/Percent.svg';
import { ReactComponent as IconPaymentRed } from 'icons/IconPaymentRed.svg';
import { useStyles } from './ListItemData.styles';

interface DataBlockProps {
  label: string;
  value: string | JSX.Element;
  icon: 'calendar' | 'percent' | 'paymentRed' | 'wallet';
}
export const ListItemData: FC<DataBlockProps> = ({ label, value, icon }) => {
  const { isMobile } = useBreakpoints();

  const ICON_MAP = useMemo(
    () => ({
      calendar: <IconCalendar width={isMobile ? '2rem' : '3rem'} height={isMobile ? '2rem' : '3rem'} />,
      percent: <IconPercent width={isMobile ? '2rem' : '3rem'} height={isMobile ? '2rem' : '3rem'} />,
      paymentRed: <IconPaymentRed width={isMobile ? '2rem' : '3rem'} height={isMobile ? '2rem' : '3rem'} />,
      wallet: <IconWallet width={isMobile ? '2rem' : '3rem'} height={isMobile ? '2rem' : '3rem'} />,
    }),
    [isMobile],
  );

  const s = useStyles();
  return (
    <div>
      <Grid container>
        <Grid item>
          <div className={s.iconWrapper}>{ICON_MAP[icon]}</div>
        </Grid>
        <Grid item>
          <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} component="h3">
            {label}
          </Typography>
          <Typography variant="h5" component="h4" className={s.subtitle}>
            {value}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};
