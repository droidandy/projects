import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  root: {
    position: 'relative',
    padding: '3.75rem',
    maxWidth: '32.5rem',
    textAlign: 'center',
    [down('xs')]: {
      padding: '2.5rem 1.25rem 1.875rem 1.25rem',
      maxWidth: 'calc(100% - 1.25rem)',
    },
  },
  cross: {
    position: 'absolute',
    top: '1.25rem',
    right: '1.25rem',
    [down('xs')]: {
      top: '0.625rem',
      right: '0.625rem',
    },
  },
  crossIcon: {
    [down('xs')]: {
      width: '0.875rem',
      height: '0.875rem',
    },
  },
  subtitle: {
    marginTop: '0.625rem',
    lineHeight: '1.875rem',
  },
  content: {
    marginTop: '1.25rem',
  },
}));

export { useStyles };
