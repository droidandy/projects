import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { background } }) => ({
    main: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      overflow: 'hidden',
      backgroundColor: background.paper,
    },
  }),
  {
    name: 'MainLayout',
  },
);

export { useStyles };
