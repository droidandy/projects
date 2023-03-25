import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { background } }) => ({
    main: {
      flexGrow: 1,
      backgroundColor: background.paper,
      '& *': {
        fontFamily: 'Open Sans, sans-serif',
      },
    },
  }),
  {
    name: 'MainLayout',
  },
);

export { useStyles };
