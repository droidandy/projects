import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { text }, breakpoints: { down } }) => ({
    title: {
      marginBottom: '1.25rem',
      color: text.primary,
      [down('xs')]: {
        marginBottom: '1.5rem',
      },
    },
  }),
  { name: 'Reviews' },
);

export { useStyles };
