import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '5rem',
      height: '100%',
    },
  },
  { name: 'LoaderProgress' },
);
