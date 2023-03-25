import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    root: {
      textAlign: 'center',
    },
    authButton: {
      maxWidth: '30rem',
      width: '100%',
    },
    checkboxes: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '40rem',
      margin: '1.25rem auto',
      '& > *': {
        alignItems: 'flex-start',
      },
    },
    checkbox: {
      textAlign: 'left',
      '& .MuiButtonBase-root': {
        marginTop: '0.4rem',
        '& *': {
          fontSize: '2rem',
        },
      },
      '&:not(:first-child)': {
        marginTop: '1rem',
      },
      [down('xs')]: {
        alignItems: 'flex-start',
        '& .MuiFormControlLabel-label': {
          textAlign: 'left',
        },
      },
    },
    phoneWrapper: {
      position: 'relative',
    },
    successIcon: {
      position: 'absolute',
      display: 'block',
      top: '50%',
      right: 0,
      transform: 'translateY(-50%)',
    },
  }),
  { name: 'RegistrationForm' },
);

export { useStyles };
