import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles(({ palette: { grey } }) => ({
  container: {
    padding: '1rem 1.875rem',
    backgroundColor: grey['200'],
    borderRadius: '0.5rem',
  },
}));
