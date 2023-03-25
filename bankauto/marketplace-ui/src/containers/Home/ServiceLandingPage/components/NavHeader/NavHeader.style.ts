import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down }, typography, palette: { text, primary } }) => ({
  container: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    [down('xs')]: {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
  },
  delimiter: {
    marginRight: '0.5rem',
    marginLeft: '0.5rem',
    fontWeight: 600,
  },
  right: {
    display: 'flex',
    flexDirection: 'row',
    [down('xs')]: {
      flexDirection: 'column',
    },
  },
  item: {
    cursor: 'pointer',
    textDecorationLine: 'underline',
    color: text.primary,
    ...typography.body1,
    '&:hover': {
      color: primary.main,
    },
    [down('xs')]: {
      ...typography.body2,
    },
  },
}));

export { useStyles };
