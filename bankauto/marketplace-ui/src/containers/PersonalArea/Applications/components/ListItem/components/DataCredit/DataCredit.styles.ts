import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  subtitle: {
    lineHeight: '1.785rem',
    [down('xs')]: {
      lineHeight: '1.5rem',
    },
  },
}));

export { useStyles };
