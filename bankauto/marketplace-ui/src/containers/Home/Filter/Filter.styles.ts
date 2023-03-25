import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexWrap: 'nowrap',
    [down('xs')]: {
      flexDirection: 'column',
    },
  },
  form: {
    flexGrow: 1,
    borderRadius: '0.5rem 0 0 0.5rem',
    [down('xs')]: {
      borderRadius: '0.5rem 0.5rem 0 0',
    },
  },
}));

export { useStyles };
