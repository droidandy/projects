import React, { FC, memo } from 'react';
import { StickerData } from '@marketplace/ui-kit/types';
import { makeStyles } from '@material-ui/core/styles';
import { StickersChipsItem } from './StickersChipsItem';

export const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '-0.625rem',
      marginLeft: '-0.625rem',
      flexFlow: 'row wrap',
      maxWidth: '100%',
      [down('xs')]: {
        overflow: 'scroll',
        flexWrap: 'nowrap',
        maxWidth: 'initial',
        '-ms-overflow-style': 'none',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },
    },
  }),
  { name: 'StickersChips' },
);

type Props = {
  items: StickerData[];
};

export const StickersChips: FC<Props> = memo(({ items }) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      {items.map(({ id, label }) => (
        <StickersChipsItem key={id} label={label} />
      ))}
    </div>
  );
});
