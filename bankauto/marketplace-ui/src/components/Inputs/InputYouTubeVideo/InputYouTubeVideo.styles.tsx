import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imgWrapper: {
    position: 'relative',
    flexBasis: '7.5rem',
    height: '4.21875rem',
  },
  iconDeleteWrapper: {
    padding: '0 1.875rem',
  },
  iconDelete: {
    cursor: 'pointer',
  },
}));

export { useStyles };
