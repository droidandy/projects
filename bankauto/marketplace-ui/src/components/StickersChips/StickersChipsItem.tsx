import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette: { common, primary } }) => ({
    root: {
      borderRadius: '0.25rem',
      padding: '0.1875rem 0.625rem',
      backgroundColor: primary.main,
      marginLeft: '0.625rem',
      marginTop: '0.625rem',
      display: 'flex',
      alignItems: 'center',
    },
    label: {
      fontSize: '0.625rem',
      fontWeight: 600,
      lineHeight: '0.875rem',
      textTransform: 'uppercase',
      color: common.white,
      whiteSpace: 'nowrap',
    },
  }),
  { name: 'StickersChipsItem' },
);

type Props = {
  label: JSX.Element | string;
};

export const StickersChipsItem: FC<Props> = ({ label }) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <span className={styles.label}>{label}</span>
    </div>
  );
};
