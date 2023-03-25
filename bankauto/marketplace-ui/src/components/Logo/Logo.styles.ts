import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  () => ({
    normal: {
      width: '11rem',
      height: '2.5rem',
    },
    small: {
      width: '9.125rem',
      height: '2rem',
    },
    large: {
      width: '16.714rem',
      height: '3.5rem',
    },
  }),
  {
    name: 'Logo',
  },
);

export { useStyles };
