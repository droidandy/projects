import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(({ palette: { secondary } }) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '0.5rem',
    padding: '1rem 0',
    backgroundColor: secondary.light,
    textAlign: 'center',
  },
  btn: {
    verticalAlign: 'top',
    padding: 0,
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}));
