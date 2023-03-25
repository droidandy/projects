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
      justifyContent: 'center',
      zIndex: 1,
    },
  },
  {
    name: 'InstalmentTabContent',
  },
);

export { useStyles };
