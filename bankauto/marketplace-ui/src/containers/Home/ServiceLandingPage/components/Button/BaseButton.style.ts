import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ typography, palette: { text } }) => ({
  label: {
    ...typography.h5,
  },
  item: {
    color: text.secondary,
    ...typography.body1,
  },
}));

export { useStyles };
