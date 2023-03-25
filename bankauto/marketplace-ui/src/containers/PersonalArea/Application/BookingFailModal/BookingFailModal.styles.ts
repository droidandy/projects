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
    title: {
      fontWeight: 700,
      paddingBottom: '1.25rem',
    },
  },
  { name: 'BookingFailModal' },
);
