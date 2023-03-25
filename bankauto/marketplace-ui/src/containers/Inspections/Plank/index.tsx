import React, { FC } from 'react';
import { Typography } from '@marketplace/ui-kit';
import { IconDocument } from 'icons/inspections';
import { useStyles } from './Plank.styles';

interface Props {
  title: string;
  link: string;
}

export const Plank: FC<Props> = ({ title, link }) => {
  const s = useStyles();
  return (
    <a className={s.root} href={link} target="_blank" rel="noreferrer">
      <IconDocument width="1.5rem" height="1.5rem" viewBox="0 0 24 24" className={s.icon} />
      <Typography color="primary" variant="h5" component="p">
        {title}
      </Typography>
    </a>
  );
};
