import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  {
    root: {
      maxWidth: '32.5rem',
    },
    icon: {
      fill: 'none',
      margin: '0 auto',
      height: '3.5rem',
      width: '3.5rem',
    },
    text: {
      paddingTop: '0.5rem',
      paddingBottom: '1rem',
    },
  },
  { name: 'LearnMoreModal' },
);
