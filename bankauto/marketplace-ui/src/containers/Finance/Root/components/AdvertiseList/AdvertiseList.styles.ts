import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      common: { white },
    },
    breakpoints: { down },
  }) => ({
    root: {
      [down('xs')]: {
        paddingRight: 0,
      },
    },
    list: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    header: {
      fontSize: '2rem',
      lineHeight: 1.5,
      marginBottom: '2.5rem',
      [down('xs')]: {
        fontSize: '1.25rem',
        marginBottom: '1.25rem',
      },
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '1.875rem',
      marginRight: '2.5rem',
      width: '100%',
      height: '17.5rem',
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      boxSizing: 'border-box',
      '&:last-child': {
        marginRight: 0,
      },
      [down('xs')]: {
        flexShrink: 0,
        padding: '1.25rem',
        width: '90%',
        marginRight: 0,
        height: '16rem',
        '&:last-child': {
          marginRight: '10px',
        },
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
      },
    },
    link: {},
    title: {
      color: white,
      position: 'relative',
      zIndex: 2,
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: '1.25rem',
      marginBottom: '0.375rem',
    },
    subtitle: {
      color: white,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      position: 'relative',
      zIndex: 2,
    },
  }),
);

export { useStyles };
