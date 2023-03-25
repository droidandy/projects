import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { primary, text }, breakpoints: { down } }) => ({
  root: {
    height: '100%',
    padding: '1.825rem 1.875rem 1.6875rem 1.875rem',
    [down('xs')]: {
      padding: '1.25rem 1.25rem 0.5625rem 1.25rem',
    },
  },
  active: {
    color: primary.main,
    cursor: 'pointer',
  },
  disabled: {
    color: text.hint,
    cursor: 'default',
  },
  send: {
    display: 'flex',
    alignItems: 'center',
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
