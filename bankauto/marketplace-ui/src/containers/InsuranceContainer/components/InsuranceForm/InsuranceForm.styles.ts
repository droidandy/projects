import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { text }, breakpoints: { down } }) => ({
  button: {
    maxWidth: '28.75rem',
    width: '100%',
    marginTop: '4.25rem',
    [down('xs')]: {
      marginTop: '0',
    },
  },
  buttonWrapper: {
    width: '100%',
    textAlign: 'center',
  },
  title: {
    marginTop: '1rem',
    marginBottom: '2rem',
  },
  subtitle: {
    paddingLeft: '2rem',
    paddingRight: '2rem',
    [down('xs')]: {
      textAlign: 'center',
    },
  },
  label: {
    color: text.primary,
  },
  text: {
    paddingTop: '.5rem',
  },
}));

export { useStyles };
