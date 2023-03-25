import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { background } }) => ({
  root: {
    display: 'block',
    width: '100%',
    height: 'auto',
  },
  containerInner: {
    margin: '0 auto',
    width: '75rem',
  },
  defaultBackground: {
    background: background.default,
  },
  paperBackground: {
    background: background.paper,
  },
}));

export { useStyles };
