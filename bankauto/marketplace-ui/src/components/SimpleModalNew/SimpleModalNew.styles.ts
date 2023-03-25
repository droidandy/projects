import { makeStyles } from '@material-ui/core/styles';
import { Theme as DefaultTheme } from '@material-ui/core/styles/createMuiTheme';

interface Props {
  loading?: boolean;
}
const useStyles = makeStyles<DefaultTheme, Props>(({ breakpoints: { down } }) => ({
  modal: {
    position: 'relative',
    maxWidth: '31.25rem',
    boxShadow: '0rem 0.5rem 3rem rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
  },
  icon: {
    fill: 'none',
    margin: '0 auto',
    height: '3.5rem',
    width: '3.5rem',
  },
  title: {
    fontWeight: 700,
  },
  closeIcon: {
    fontSize: '1rem',
  },
  closeIconBox: {
    position: 'absolute',
  },
  mainButton: {
    padding: ({ loading }) => (loading ? '0.9375rem' : '1rem 1.375rem 1.25rem 1.375rem'),
  },
  btn: {
    width: '10.625rem',
    height: '3.75rem',
    [down('xs')]: {
      width: '100%',
    },
  },
}));
export { useStyles };
