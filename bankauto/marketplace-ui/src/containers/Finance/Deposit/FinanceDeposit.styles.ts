import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  hero: {
    marginBottom: '2.4375rem',
    [down('xs')]: {
      marginBottom: 0,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '50%',
      bottom: 0,
      background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%)',
      [down('xs')]: {
        display: 'none',
      },
    },
  },
  heroContent: {
    top: '-5.125rem',
    [down('xs')]: {
      top: '2.8125rem',
    },
  },
}));

export { useStyles };
