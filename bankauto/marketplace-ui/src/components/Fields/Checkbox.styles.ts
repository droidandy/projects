import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  checkboxWrapper: {
    position: 'relative',
  },

  checkboxError: {
    bottom: '-1rem',
    left: '1.875rem',
  },
}));

export { useStyles };
