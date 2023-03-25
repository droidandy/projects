import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down }, palette: { secondary, grey } }) => ({
  container: {
    display: 'inherit',
    backgroundColor: grey[100],
    padding: '0 19rem',
    [down('xs')]: {
      backgroundColor: grey[200],
      padding: '0 0.625rem 0 0.625rem',
    },
  },
  content: {
    position: 'relative',
    top: '-3.5rem',
    padding: '3.75rem 8.438rem',
    background: secondary.contrastText,
    boxShadow: '0px 8px 48px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    width: '100%',
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    [down('xs')]: {
      top: '-2.5rem',
      padding: '1.25rem 1.25rem',
      flexDirection: 'column',
    },
  },
}));

export { useStyles };
