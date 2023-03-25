import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({
    palette: {
      primary: { main },
    },
    breakpoints: { down },
  }) => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: '100%',
      [down('xs')]: {
        minHeight: '20rem',
      },
    },
    button: {
      marginTop: '1.875rem',
    },
    authText: {
      textAlign: 'center',
    },
    textLink: {
      textDecoration: 'underline',
      cursor: 'pointer',
      color: main,
      outline: 0,
    },
  }),
  { name: 'AuthRequired' },
);
