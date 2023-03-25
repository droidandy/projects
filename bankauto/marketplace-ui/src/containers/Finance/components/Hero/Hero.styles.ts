import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    breakpoints: { down },
    palette: {
      common: { white },
    },
  }) => ({
    hero: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      height: '40rem',
      overflow: 'hidden',
      [down('xs')]: {
        height: '23.4375rem',
      },
      '& > div:first-child': {
        bottom: 0,
      },
    },
    darkOverlay: {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    contentTopLayer: {
      width: '98.75rem',
      zIndex: 1,
      position: 'relative',
      [down('xs')]: {
        textAlign: 'center',
        top: '1.875rem',
      },
    },
    bgImage: {},
    innerContent: {
      marginBottom: '3.75rem',
      [down('xs')]: {
        marginBottom: '3.4375rem',
      },
    },
    title: {
      color: white,
      fontSize: '4rem',
      lineHeight: 1.5,
      [down('xs')]: {
        fontSize: '1.25rem',
      },
    },
    subTitle: {
      color: white,
      fontSize: '1.5rem',
      lineHeight: 1.5,
      [down('xs')]: {
        fontSize: '0.875rem',
        lineHeight: 1.43,
      },
    },
    button: {
      width: '22.8125rem',
      marginBottom: '1.75rem',
      padding: '1rem 1rem 1.25rem',
      fontWeight: 700,
      fontSize: '1rem',
      borderRadius: '8px',
      [down('xs')]: {
        width: '17.5rem',
        padding: '0.6875rem 0.5rem 0.9375rem',
        marginBottom: 0,
      },
    },
  }),
  { name: 'Finance-Hero' },
);

export { useStyles };
