import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  root: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    [down('xs')]: {
      flexDirection: 'column',
      transform: 'translateY(-4.6875rem)',
    },
  },
  imageContainer: {
    maxWidth: '31.25rem',
    height: '20rem',
    transform: 'translateY(-4.75rem)',
    position: 'relative',
    width: '32%',
    [down('xs')]: {
      height: '16.75rem',
      width: '100%',
      maxWidth: '20.9375rem',
      transform: 'translateY(0)',
    },
  },
  image: {
    height: '25rem',
    width: 'auto',
    [down('xs')]: {
      height: 'inherit',
      maxWidth: '20.9375rem',
      width: '100%',
    },
  },
  infoContent: {
    width: '68%',
    paddingLeft: '2.5rem',
    [down('xs')]: {
      width: '100%',
      paddingLeft: 0,
    },
  },
  title: {
    marginBottom: '1.875rem',
    [down('xs')]: {
      marginBottom: '1.25rem',
    },
  },
}));

export { useStyles };
