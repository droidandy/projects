import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { error } }) => ({
  iconWrapper: {
    width: '3.5rem',
    height: '3.5rem',
    borderRadius: '50%',
    backgroundColor: error.main,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    lineHeight: '1rem',
    transform: 'translate(-50%, -50%)',
    '& path': {
      fill: 'none',
    },
  },
  iconComponent: {
    width: '1.5rem',
    height: '2rem',
    overflow: 'visible',
  },
}));

export { useStyles };
