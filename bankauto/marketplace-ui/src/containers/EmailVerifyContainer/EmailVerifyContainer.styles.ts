import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  () => ({
    icon: {
      fill: 'none',
      margin: '0 auto',
      height: '4.75rem',
      width: '4.75rem',
    },
  }),
  { name: 'EmailVerifyContainer' },
);

export { useStyles };
