import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  paper: {
    position: 'relative',
    padding: '13.2rem 1.875rem 1.875rem 1.875rem',
    width: '48.125rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    outline: 'none',
    [down('xs')]: {
      width: 'calc(100% - 1.25rem)',
      padding: '1.25rem 1.25rem 1.25rem 1.25rem',
    },
  },
  image: {
    position: 'absolute',
    top: '-7.8rem',
    left: '50%',
    transform: 'translateX(-55%)',
    height: '21rem',
  },
  title: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    textAlign: 'center',
  },
  desc: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    marginTop: '1.25rem',
    [down('xs')]: {
      marginTop: '1.25rem',
    },
  },
  button: {
    marginTop: '1.875rem',
    width: '22.8125rem',
    height: '3.125rem',
    [down('xs')]: {
      width: '100%',
      marginTop: '1.375rem',
    },
  },
}));

export { useStyles };
