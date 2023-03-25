import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { text }, typography, breakpoints: { down } }) => ({
    container: {
      display: 'block',
      padding: '2.5rem 22rem',
      [down('xs')]: {
        padding: ' 1.25rem 0.625rem  1.25rem 0.625rem',
      },
    },
    title: {
      marginBottom: '3.75rem',
      [down('xs')]: {
        marginBottom: ' 1.25rem',
      },
    },
  }),
  { name: 'ServiceLandingPage' },
);

export { useStyles };
