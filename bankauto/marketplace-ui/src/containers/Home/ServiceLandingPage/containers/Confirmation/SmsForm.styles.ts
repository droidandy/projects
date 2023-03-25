import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({
    palette: {
      primary: { main },
    },
    breakpoints: { down },
  }) => ({
    root: {
      textAlign: 'center',
    },
    actionButton: {
      marginTop: '2.5rem',
    },
    authButton: {
      maxWidth: '30rem',
      width: '100%',
    },
    checkboxes: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '40rem',
      margin: '2.5rem auto',
    },
    label: {
      textAlign: 'left',
    },
    checkbox: {
      [down('xs')]: {
        alignItems: 'flex-start',
        '& .MuiFormControlLabel-label': {
          textAlign: 'left',
        },
        '& .MuiButtonBase-root': {
          marginTop: '0.3rem',
        },
      },
    },
    editPhoneIcon: {
      position: 'absolute',
      top: '50%',
      right: 0,
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      width: '2rem',
      height: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 1,
      transition: 'all 0.2s ease-out',
      '&:hover': {
        opacity: 0.7,
      },
    },
    resendCodeButton: {
      display: 'flex',
      width: '100%',
      paddingLeft: 0,
      paddingRight: 0,
      justifyContent: 'space-between',
      [down('xs')]: {
        color: main,
        padding: '0',
      },
      // color: g500,
    },
    refreshIcon: {
      marginRight: '1.25rem',
    },
    resendCode: {
      display: 'flex',
      alignItems: 'center',
    },
    arrowIcon: {
      [down('xs')]: {
        display: 'none',
      },
    },
  }),
  { name: 'SmsForm' },
);
