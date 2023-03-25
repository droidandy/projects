import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  mainTitle: {
    lineHeight: '1.875rem',
    [down('xs')]: {
      lineHeight: '1.5rem',
      fontWeight: 700,
    },
  },
}));
