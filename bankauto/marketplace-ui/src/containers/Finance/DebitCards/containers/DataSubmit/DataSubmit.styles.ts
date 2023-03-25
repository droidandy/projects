import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { grey }, breakpoints: { down } }) => ({
  root: {
    '&>div': {
      backgroundColor: grey[200],
      borderRadius: '0.5rem',
      padding: '2.5rem 2.5rem 5rem',
      [down('xs')]: {
        padding: '1.25rem',
      },
    },
  },
}));

export { useStyles };
