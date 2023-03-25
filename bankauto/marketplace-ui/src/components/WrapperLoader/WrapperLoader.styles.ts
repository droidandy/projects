import { makeStyles } from '@material-ui/core/styles';
import { Theme as DefaultTheme } from '@material-ui/core/styles/createMuiTheme';

interface Props {
  loading: boolean;
}

export const useStyles = makeStyles<DefaultTheme, Props>(({ breakpoints: { down } }) => ({
  root: {
    position: 'relative',
    minHeight: '25.5rem',
    '&:after': {
      content: '""',
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      backgroundColor: ({ loading }) => (loading ? 'rgba(255,255,255,0.5)' : 'transparent'),
      zIndex: 10,
      pointerEvents: 'none',
    },
  },
  loader: {
    position: 'sticky',
    top: '35.5rem',
    zIndex: 4,
    marginLeft: 'calc(50% - 2.25rem)',
    [down('xs')]: {
      marginLeft: 'calc(50% - 1.5rem)',
    },
  },
  loaderWrapper: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
}));
