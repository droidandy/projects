import React, { FC } from 'react';
import { Typography } from '@marketplace/ui-kit';
import { useStyles } from './Plank.styles';
import { getPdfIcon } from '../../helpers/documents';

interface Props {
  plank: {
    id: number;
    title: string;
    desc: string;
    iconVariant: string;
    link: string;
  };
}

const Plank: FC<Props> = ({ plank }) => {
  const s = useStyles();
  return (
    <a className={s.plank} href={plank.link} target="_blank" rel="noreferrer">
      <div className={s.icon}>{getPdfIcon(plank.iconVariant)}</div>
      <div>
        <Typography color="primary" variant="h5">
          {plank.title}
        </Typography>
        <Typography variant="caption" color="textPrimary">
          {plank.desc}
        </Typography>
      </div>
    </a>
  );
};

export { Plank };
