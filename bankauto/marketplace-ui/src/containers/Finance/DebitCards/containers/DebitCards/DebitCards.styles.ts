import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { grey }, breakpoints: { down } }) => ({
  root: {
    [down('xs')]: {
      backgroundColor: grey[100],
    },
  },
}));

export { useStyles };
