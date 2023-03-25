import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      primary,
      text,
      common: { white },
    },
    breakpoints: { down },
  }) => ({
    flexContainer: {
      backgroundColor: primary.main,
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
    },
    autostatData: {
      padding: '10px',
      color: white,
      [down('xs')]: {
        textAlign: 'center',
        paddingBottom: '30px',
      },
    },
    autostatLabel: {
      width: '100%',
      lineHeight: '1.85em',
      fontSize: '1em',
    },
    priceFromAutostat: {
      width: '100%',
      fontSize: '1.875em',
    },
    price: {
      borderRadius: '8px',
    },
    info: {
      position: 'relative',
      cursor: 'pointer',
      display: 'inline-block',
      textAlign: 'center',
      marginLeft: '.625rem',
      fontSize: '.8rem',
      '&:after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        width: '1.25rem',
        height: '1.25rem',
        borderRadius: '50%',
        zIndex: -1,
        background: white,
      },
      zIndex: 1,
      outline: 0,
      color: primary.main,
      fontWeight: 'bold',
      lineHeight: 1.6,
      width: '1.25rem',
      height: '1.25rem',
    },
    hintContainer: {
      backgroundColor: white,
      fontSize: '1em',
      color: text.primary,
      padding: '1.875rem',
      width: '95%',
      maxWidth: '57.5rem',
      borderRadius: '0.5rem',
      boxShadow: '0px 8px 48px rgba(0, 0, 0, 0.1)',
    },
    infoContainer: {},
    infoItem: {
      '&:not(:first-of-type)': {
        paddingTop: '1rem',
      },
    },
    infoList: {
      margin: '0',
      marginLeft: '1rem',
      listStyle: 'disc',
      '&>li': {
        padding: '0',
      },
    },
  }),
);

export { useStyles };
