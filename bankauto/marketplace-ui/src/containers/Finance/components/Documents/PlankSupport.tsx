import React, { FC } from 'react';
import { Typography } from '@marketplace/ui-kit';
import { ReactComponent as IconSupport } from 'icons/iconSupport.svg';
import { useStyles } from './PlankSupport.styles';

export interface Props {
  type?: 'credit' | 'deposit' | 'cards';
}

const LINKS = {
  credit: 'credits/',
  deposit: 'deposits/',
  cards: 'cards/',
};

const PlankSupport: FC<Props> = ({ type }) => {
  const s = useStyles();
  const href = `https://www.rgsbank.ru/support/${type ? LINKS[type] : ''}`;
  return (
    <a className={s.plank} href={href} target="_blank" rel="noreferrer">
      <div className={s.icon}>
        <IconSupport width="1.5rem" />
      </div>
      <div>
        <Typography className={s.title} variant="h5">
          Перейти в раздел поддержки
        </Typography>
      </div>
    </a>
  );
};

export { PlankSupport };
