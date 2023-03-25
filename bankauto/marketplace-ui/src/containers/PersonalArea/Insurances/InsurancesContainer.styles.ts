import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles(({ breakpoints: { down }, palette: { grey } }) => ({
  container: {
    padding: '1rem 1.875rem',
    backgroundColor: grey['200'],
    borderRadius: '0.5rem',
  },
  contentContainer: {
    [down('xs')]: {
      width: '100%',
      display: 'flex',
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
  },
}));
