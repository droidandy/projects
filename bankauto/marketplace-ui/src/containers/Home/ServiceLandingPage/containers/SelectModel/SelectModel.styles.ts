import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, typography, palette: { text, grey } }) => ({
    label: {
      ...typography.h4,
      color: text.primary,
      marginTop: '1.875rem',
      marginBottom: '1.25rem',
      [down('xs')]: {
        marginTop: '1.25rem',
        ...typography.h5,
      },
    },
  }),
  { name: 'SelectModel' },
);

export { useStyles };
