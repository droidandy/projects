import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  {
    title: {
      cursor: 'pointer',
    },
    disabledPrice: {
      textDecoration: 'line-through',
    },
  },
  {
    name: 'SwitchBlock',
  },
);

export { useStyles };
