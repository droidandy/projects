import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({
    palette: {
      common: { white },
    },
    breakpoints: { down },
  }) => ({
    root: {
      position: 'relative',
      maxWidth: '31.25rem',
      boxShadow: '0rem 0.5rem 3rem rgba(0, 0, 0, 0.1)',
      borderRadius: '0.5rem',
      [down('xs')]: {
        position: 'relative',
        maxWidth: '31.25rem',
        top: 'unset',
        right: 'unset',
        bottom: 'unset',
        left: 'unset',
      },
    },
    successModalContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: white,
    },
    successIconWrapper: {
      paddingBottom: '2rem',
    },
    successTextWrapper: {
      textAlign: 'center',
      paddingBottom: '2.5rem',
    },
    successModalBtn: {
      minWidth: '20.25rem',
    },
    textWrapper: {
      paddingBottom: '1.5rem',
    },
    icon: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fill: 'none',
      margin: '0 auto',
      height: '4.75rem',
      width: '4.75rem',
    },
  }),
  { name: 'AuthenticationContainerC2C' },
);
