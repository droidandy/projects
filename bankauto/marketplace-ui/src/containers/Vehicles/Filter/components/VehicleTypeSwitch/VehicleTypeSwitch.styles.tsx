import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ palette: { background, primary, grey, text } }) => ({
  root: {
    width: '100%',
    background: grey[200],
    border: 0,
    borderRadius: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.375rem',
  },
  light: {
    background: background.paper,
  },
  input: {
    display: 'none',
  },
  label: {
    color: text.primary,
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    // width: '33.3%',
    width: '49%',
    textAlign: 'center',
    cursor: 'pointer',
  },
  active: {
    background: primary.main,
    color: primary.contrastText,
    fontWeight: 700,
    borderRadius: '0.25rem',
    padding: '0.1875rem 0 0.3125rem',
  },
}));

export { useStyles };
