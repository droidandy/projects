import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  root: {
    width: '100%',
    display: 'flex',
    [down('xs')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  item: {
    marginRight: '2.5rem',
    alignSelf: 'stretch',
    [down('xs')]: {
      marginRight: 0,
      marginBottom: '0.625rem',
      alignSelf: 'center',
    },
    '&:last-child': {
      marginRight: 0,
      marginBottom: 0,
    },
  },
}));

export { useStyles };
