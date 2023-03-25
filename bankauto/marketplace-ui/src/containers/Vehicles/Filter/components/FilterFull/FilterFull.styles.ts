import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(({ palette: { secondary } }) => ({
  colors: {
    padding: '1.25rem 0',
  },
  bold: {
    fontWeight: 700,
  },
  switch: {
    justifyContent: 'space-between',
    '& > span': {
      margin: 0,
    },
    paddingBottom: '1.25rem',
    borderBottom: `1px solid ${secondary.light}`,
  },
}));
