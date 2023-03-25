import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  root: {
    display: 'flex',
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'center',
    [down('xs')]: {
      paddingLeft: '.625rem',
      paddingRight: '.625rem',
    },
  },
  containerInner: {
    flex: '1 0 auto',
    maxWidth: '98.75rem',
    [down('md')]: {
      maxWidth: '92.75rem',
    },
    [down('sm')]: {
      maxWidth: '90.75rem',
    },
    [down('xs')]: {
      maxWidth: '100%',
    },
  },
}));

export { useStyles };
