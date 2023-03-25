import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    breakpoints: { up },
    palette: {
      secondary: { light },
    },
  }) => ({
    root: {
      [up('sm')]: {
        background: light,
      },
    },
    code: {
      width: '17.8125rem',
      height: '17.8125rem',
    },
  }),
);

export { useStyles };
