import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  root: {
    maxHeight: 'calc(100vh - 5rem)',
    width: '90rem',
    textAlign: 'center',
    [down('xs')]: {
      maxHeight: 'calc(100vh - 2.5rem)',
      maxWidth: 'calc(100vw - 2.5rem)',
    },
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    padding: '1.5rem 4.25rem',
    [down('xs')]: {
      padding: '0.5rem 2.75rem 0.5rem 0',
    },
  },
  titleText: {
    fontSize: '1.5rem',
    [down('xs')]: {
      fontSize: '1rem',
    },
  },
  cross: {
    position: 'absolute',
    top: '2.5rem',
    right: '2.5rem',
    transform: 'translate(50%,-50%)',
    [down('xs')]: {
      top: '1.5rem',
      right: '1.5rem',
    },
  },
  crossIcon: {
    [down('xs')]: {
      width: '0.875rem',
      height: '0.875rem',
    },
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    maxHeight: 'calc(100vh - 10rem)',
    width: '100%',
    padding: '5rem 6rem',
    boxSizing: 'border-box',
    overflow: 'auto',
    [down('xs')]: {
      padding: '1rem',
    },
  },
}));

export { useStyles };
