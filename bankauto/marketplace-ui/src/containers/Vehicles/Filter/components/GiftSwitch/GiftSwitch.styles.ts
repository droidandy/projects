import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(({ palette: { secondary, background }, breakpoints: { down } }) => ({
  root: {
    width: '100%',
    justifyContent: 'space-between',
    '& > span': {
      margin: 0,
    },
    paddingBottom: '1.25rem',
    borderBottom: `1px solid ${secondary.light}`,
    [down('xs')]: {
      borderBottom: 'none',
      padding: '1rem 1.25rem 1.25rem',
      backgroundColor: background.paper,
      borderRadius: '.5rem',
    },
  },
}));
