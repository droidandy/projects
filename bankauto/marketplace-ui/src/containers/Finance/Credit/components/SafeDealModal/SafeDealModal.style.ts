import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  paper: {
    position: 'relative',
    padding: '11.3rem 3.75rem 3.75rem 3.75rem',
    width: '31.25rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    outline: 'none',
    [down('xs')]: {
      width: 'calc(100% - 1.25rem)',
      padding: '2.5rem 1.25rem 1.25rem 1.25rem',
    },
  },
  image: {
    position: 'absolute',
    top: '-5.6rem',
    left: '50%',
    transform: 'translateX(-55%)',
    height: '16.8rem',
  },
  desc: {
    marginTop: '1.875rem',
    [down('xs')]: {
      marginTop: '1.25rem',
    },
  },
  button: {
    marginTop: '2.5rem',
    width: '22.8125rem',
    height: '3.75rem',
    [down('xs')]: {
      height: '3.125rem',
      width: '100%',
      marginTop: '1.25rem',
    },
  },
}));

export { useStyles };
