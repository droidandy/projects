import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(
  ({ palette: { primary }, breakpoints: { down } }) => ({
    active: {
      color: primary.main,
    },
    sortText: {
      [down('xs')]: {
        fontWeight: 600,
      },
    },
    iconDown: {
      width: '1.25rem',
      height: '1.25rem',
      marginLeft: '0.625rem',
      [down('xs')]: {
        width: '1rem',
        height: '1rem',
        fontSize: '1rem',
        fill: 'none',
        marginLeft: 0,
        marginTop: '0.25rem',
      },
    },
  }),
  { name: 'SortMenu' },
);
