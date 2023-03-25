import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  text: {
    paddingTop: '.5rem',
  },
  renisLogo: {
    maxWidth: '23.4375rem',
    width: '100%',
    height: '1.875rem',
  },
  block: {
    padding: '1.875rem 2.5rem',
    [down('xs')]: {
      padding: '1.25rem',
    },
  },
}));

export { useStyles };
