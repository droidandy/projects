import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  animationWrapper: {
    margin: '1.625rem 1.3125rem',
    [down('xs')]: {
      margin: '1.25rem auto',
    },
  },
  animationImage: {
    display: 'block',
    maxWidth: '100%',
    width: '23.5625rem',
    margin: 'auto',
    [down('xs')]: {
      width: '18.4375rem',
    },
  },
}));

export { useStyles };
