import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { background } }) => ({
    main: {
      flexGrow: 1,
      backgroundColor: background.paper,
    },
  }),
  {
    name: 'FinanceLayout',
  },
);

export { useStyles };
