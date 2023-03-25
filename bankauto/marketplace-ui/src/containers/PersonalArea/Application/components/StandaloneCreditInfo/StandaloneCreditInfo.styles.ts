import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      secondary: { light },
    },
  }) => ({
    rightBlock: {
      borderLeft: `1px solid ${light}`,
    },
  }),
);

export { useStyles };
