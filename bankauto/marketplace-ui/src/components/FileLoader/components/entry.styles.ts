import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    root: {
      cursor: 'pointer',
    },
    fontPrimary: {
      color: primary.main,
    },
    active: {
      border: '1px dashed blue',
    },
    accept: {
      border: '1px dashed green',
    },
    reject: {
      border: '1px dashed red',
    },
  }),
  { name: 'Entry' },
);

export { useStyles };
