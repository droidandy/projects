import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  subtitle: {
    lineHeight: '1.785rem',
    fontSize: '0.9rem',
    [down('xs')]: {
      lineHeight: '1.5rem',
    },
  },
  iconWrapper: {
    marginRight: '1.125rem',
    [down('xs')]: {
      marginRight: '1.125rem',
    },
  },
}));

export { useStyles };
