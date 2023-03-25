import React, { FC } from 'react';
import { Icon, Typography } from '@marketplace/ui-kit';
import { TeaserData } from 'helpers/getAutotekaTeaserData';
import cx from 'classnames';
import { useStyles } from './Teaser.styles';

interface TeaserProps {
  data: TeaserData[] | null;
  className?: string;
}

export const Teaser: FC<TeaserProps> = ({ data, className }) => {
  const s = useStyles();
  return (
    <>
      {data
        ? data.map((item) =>
            item.reportAvailable ? (
              <div key={item.title} className={cx(s.singleItem, className)}>
                <Icon component={item.icon} fill="none" viewBox="0 0 32 32" className={s.icon} />
                <Typography variant="body1">{item.title}</Typography>
              </div>
            ) : null,
          )
        : null}
    </>
  );
};
