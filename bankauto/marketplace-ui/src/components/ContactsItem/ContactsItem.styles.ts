import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  link: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  itemContainer: {
    padding: '1.25rem 0',
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    [down('xs')]: {
      padding: 0,
    },
  },
  infoContainer: {
    paddingLeft: '0.625rem',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export { useStyles };
