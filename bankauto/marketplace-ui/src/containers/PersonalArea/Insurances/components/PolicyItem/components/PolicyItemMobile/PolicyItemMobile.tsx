import { Insurance } from '@marketplace/ui-kit/types';
import React, { FC } from 'react';
import { PoliciesIcon } from 'icons/profileRoot';
import { Button, Divider, Grid, PriceFormat, Typography } from '@marketplace/ui-kit';
import { Link, ListItemData } from 'components';
import { Chips } from 'containers/PersonalArea/components';
import { useStyles } from './PolicyItemMobile.styles';
import cx from 'classnames';

interface Props {
  item: Insurance;
  chips: {
    text: string;
    bgcolor: string;
  }[];
  fullName: string;
  period: string;
}

const PolicyItemMobile: FC<Props> = ({ item, chips, fullName, period }) => {
  const policy = item.policies[0];
  const { vehicle } = policy;

  const s = useStyles();
  return (
    <div className={s.root}>
      <div className={s.policyNameWrapper}>
        <div className={s.iconWrapper}>
          <PoliciesIcon width={24} height={24} className={s.icon} />
        </div>
        <div className={s.policyName}>
          <Typography variant="h5" component="h3">
            Полис
          </Typography>
          <Typography variant="h3" className={s.subtitle}>
            ОСАГО
          </Typography>
        </div>
      </div>

      <div className={cx(s.dividerWrapper, s.smallMargin)}>
        <Divider />
      </div>

      <div className={s.subBlock}>
        <Typography variant="subtitle1" style={{ fontWeight: 'bold' }} color="secondary">
          № {policy.number}
        </Typography>
        <Typography variant="subtitle1" style={{ fontWeight: 'bold' }} color="secondary">
          Тариф: {policy.type}
        </Typography>
      </div>
      <div className={s.subBlock}>
        <Chips items={chips} />
      </div>
      <Typography variant="h5" component="h5" className={s.subBlock}>
        {vehicle.brand} {vehicle.model}
      </Typography>
      <Typography variant="body1" color="secondary" style={{ marginBottom: '1.25rem' }}>
        Госномер {vehicle.number}
      </Typography>
      <Typography variant="body2">{fullName}</Typography>

      <div className={s.dividerWrapper}>
        <Divider />
      </div>

      <Grid container>
        <Grid item xs={12}>
          <div className={s.listItemWrapper}>
            <ListItemData icon="wallet" label="Стоимость полиса" value={<PriceFormat value={item.price} />} />
          </div>
        </Grid>
        <Grid item xs={12}>
          <ListItemData icon="calendar" label="Период действия" value={period} />
        </Grid>
      </Grid>

      <div className={s.dividerWrapper}>
        <Divider />
      </div>

      <Link href={policy.pdf} target="_blank">
        <Button variant="contained" color="primary" size="medium" fullWidth>
          <Typography variant="subtitle1" component="span">
            Скачать полис
          </Typography>
        </Button>
      </Link>
    </div>
  );
};

export { PolicyItemMobile };
