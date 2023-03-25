import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  {
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    flowWrapper: {
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1,
      zIndex: 1,
      paddingTop: '2rem',
    },
  },
  {
    name: 'SellTabContent',
  },
);

export { useStyles };
