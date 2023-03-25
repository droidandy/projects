import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      common: { white },
    },
  }) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100vw',
      background: white,
    },
    drawerPaper: {
      width: '100%',
    },
  }),
);

export { useStyles };
