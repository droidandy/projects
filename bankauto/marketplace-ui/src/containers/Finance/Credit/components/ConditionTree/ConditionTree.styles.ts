import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    breakpoints: { down },
    palette: {
      secondary: { light },
      common: { white },
      primary: { main },
    },
  }) => ({
    root: {
      padding: '2.5rem 0',
      [down('xs')]: {
        padding: '1.25rem 0',
      },
    },

    branch: {
      '&:last-child': {
        paddingBottom: 0,
      },
    },
    title: {
      marginBottom: '1.875rem',
      [down('xs')]: {
        marginBottom: '1.25rem',
        lineHeight: '1.875rem',
      },
    },

    button: {
      width: '25rem',
      height: '6.25rem',
      padding: '1.25rem',
      marginRight: '1.875rem',
      borderRadius: '0.5rem',
      border: `1px solid ${light}`,
      backgroundColor: white,
      justifyContent: 'start',
      [down('xs')]: {
        width: '20.9375rem',
        maxWidth: '100%',
        height: '5rem',
        padding: '0.625rem',
        marginRight: 0,
        marginBottom: '0.625rem',
      },
      '&:last-child': {
        marginRight: 0,
        marginBottom: 0,
      },
    },
    buttonActive: {
      backgroundColor: light,
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '3.75rem',
      height: '3.75rem',
      marginRight: '0.625rem',
      borderRadius: '0.25rem',
      backgroundColor: light,
      [down('xs')]: {
        marginLeft: '0.3125rem',
      },
      '& svg': {
        maxWidth: '2.5rem',
      },
    },
    iconActive: {
      backgroundColor: main,
    },
  }),
);

export { useStyles };
