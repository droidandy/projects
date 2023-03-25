import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { background, text } }) => ({
  root: {
    background: background.paper,
    padding: '2rem 0',
    height: '100%',
  },
  title: {
    color: text.primary,
    fontWeight: 400,
    marginBottom: '2rem',
  },
  hint: {
    maxWidth: '40rem',
    marginBottom: '2rem',
  },
}));

export { useStyles };
