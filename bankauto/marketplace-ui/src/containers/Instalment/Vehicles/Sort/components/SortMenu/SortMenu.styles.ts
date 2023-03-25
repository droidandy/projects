import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    active: {
      color: primary.main,
    },
  }),
  { name: 'SortMenu' },
);
