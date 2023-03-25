import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { grey } }) => ({
  divider: {
    height: '0.625rem',
    backgroundColor: grey[200],
  },
}));

export { useStyles };
