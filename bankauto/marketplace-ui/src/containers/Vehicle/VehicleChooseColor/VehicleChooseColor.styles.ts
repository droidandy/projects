import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  () => ({
    mobileClass: {
      fontSize: '1.75rem',
      display: 'flex',
      alignItems: 'center',
      maxWidth: '100%',
      overflow: 'hidden',
      '&>div': {
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'auto',
      },
    },
    desktopClass: {
      fontSize: '2rem',
    },
  }),
  { name: 'MKP-VehicleChooseColor' },
);

export { useStyles };
