import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { primary, text } }) => ({
  root: {
    height: '100%',
  },
  active: {
    color: primary.main,
    cursor: 'pointer',
  },
  disabled: {
    color: text.hint,
    cursor: 'default',
  },
  resend: {
    cursor: 'pointer',
  },
  reloadIcon: {
    marginTop: '.25rem',
    width: '1rem',
  },
  timer: {
    color: primary.main,
  },
}));

export { useStyles };
