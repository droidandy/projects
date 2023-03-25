import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    root: {
      zIndex: 1200,
      position: 'fixed',
      bottom: 0,
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'space-around',
      alignItems: 'center',
      maxHeight: '5rem',
      height: '100%',
      padding: '1rem',
      background: '#FFFFFF',
      boxShadow: '0 .2rem 1rem rgba(0,0,0,.25)',
      [down('md')]: {
        justifyContent: 'center',
        overflow: 'hidden',
      },
      [down('xs')]: {
        maxHeight: '6rem',
      },
    },
    content: {
      position: 'relative',
    },
    title: {
      maxWidth: '78rem',
      textAlign: 'center',
      [down('xs')]: {
        textAlign: 'left',
        '& > h6': {
          fontWeight: 400,
          fontSize: '1rem',
        },
      },
    },
    btnAccept: {
      textTransform: 'uppercase',
      [down('xs')]: {
        margin: '1rem',
      },
    },
    btnClose: {
      position: 'absolute',
      top: '-1.165rem',
      right: '-22.29rem',
      zIndex: 2,
      color: '#000000',
      padding: '1rem',
      [down('xs')]: {
        overflow: 'hidden',
        top: '-1.375rem',
        right: '-1.865rem',
      },
    },
  }),
  { name: 'CookieNotice' },
);

export { useStyles };
