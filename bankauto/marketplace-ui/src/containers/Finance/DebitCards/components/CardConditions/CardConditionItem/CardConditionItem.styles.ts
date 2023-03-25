import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette, breakpoints: { down } }) => ({
  smallText: {
    fontSize: '1.25rem',
    [down('xs')]: {
      fontSize: 'inherit',
    },
  },
  titleValue: {},
}));

export { useStyles };
