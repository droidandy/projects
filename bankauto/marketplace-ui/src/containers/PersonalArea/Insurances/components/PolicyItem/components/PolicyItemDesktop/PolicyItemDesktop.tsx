import { Insurance } from '@marketplace/ui-kit/types';
import React, { FC } from 'react';
import { PoliciesIcon } from 'icons/profileRoot';
import { Button, PriceFormat, Typography } from '@marketplace/ui-kit';
import { Link, ListItemData } from 'components';
import { Chips } from 'containers/PersonalArea/components';
import { useStyles } from './PolicyItemDesktop.styles';
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

const PolicyItemDesktop: FC<Props> = ({ item, chips, fullName, period }) => {
  const policy = item.policies[0];
  const { vehicle } = policy;

  const s = useStyles();
  return (
    <>
      <div className={s.policy}>
        <div className={s.leftBlock}>
          <div className={s.iconWrapper}>
            <PoliciesIcon width={64} height={64} className={s.icon} />
          </div>
        </div>
        <div className={s.mainInfo}>
          <div>
            <div className={s.flex}>
              <Typography variant="h3">
                Полис <span className={s.subtitle}>ОСАГО</span>
              </Typography>
              <div className={s.chipsWrapper}>
                <Chips items={chips} />
              </div>
            </div>
            <div className={cx(s.flex, s.subBlock)}>
              <Typography className={s.boldText} variant="subtitle1" color="secondary">
                № {policy.number}
              </Typography>
              <Typography className={cx(s.nextBlock, s.boldText)} variant="subtitle1" color="secondary">
                Тариф: {policy.type}
              </Typography>
            </div>
            <div className={s.block}>
              <Typography variant="h5" component="h5">
                {vehicle.brand} {vehicle.model}
              </Typography>
              <Typography variant="body1" color="secondary">
                Госномер {vehicle.number}
              </Typography>
            </div>
            <Typography variant="body2">{fullName}</Typography>
          </div>
          <div className={s.buttonWrapper}>
            <Link href={policy.pdf} target="_blank">
              <Button variant="contained" color="primary" size="medium" fullWidth>
                <Typography variant="subtitle1" component="span">
                  Скачать полис
                </Typography>
              </Button>
            </Link>
          </div>
        </div>
        <div className={s.rightBlock}>
          <div className={s.listItemWrapper}>
            <ListItemData icon="wallet" label="Стоимость полиса" value={<PriceFormat value={item.price} />} />
          </div>
          <ListItemData icon="calendar" label="Период действия" value={period} />
        </div>
      </div>
    </>
  );
};

export { PolicyItemDesktop };
