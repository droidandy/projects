import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    root: {
      width: '100%',
      zIndex: 3,
      display: 'flex',
      flexWrap: 'nowrap',
      [down('xs')]: {
        flexDirection: 'column',
      },
    },
    desktopGroup: {
      flexGrow: 1,
      borderRadius: '0.5rem 0 0 0.5rem',
      [down('xs')]: {
        borderRadius: '0.5rem 0.5rem 0 0',
      },
    },
    control: {
      height: '5rem',
      [down('xs')]: {
        height: '3.75rem',
      },
    },
  }),
  { name: 'SellFilter' },
);

export { useStyles };
