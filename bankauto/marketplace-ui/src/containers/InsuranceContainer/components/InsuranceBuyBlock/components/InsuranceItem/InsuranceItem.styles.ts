import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { success } }) => ({
  successText: {
    fontSize: '1rem',
    color: success.main,
    fontWeight: 700,
    lineHeight: '1.25rem',
  },
  detailsButton: {
    paddingTop: '0.625rem',
    paddingBottom: '0.625rem',
    fontSize: '1rem',
    lineHeight: '1.25rem',
    fontWeight: 'bold',
  },
}));

export { useStyles };
