import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette, breakpoints: { down } }) => ({
  root: {
    background: palette.grey['200'],
    borderRadius: '0.5rem',
  },
  smallText: {
    marginRight: '0.4375rem',
  },
  titleValue: {
    fontWeight: 700,
    fontSize: '2rem',
    lineHeight: '1.5rem',
    [down('xs')]: {
      fontSize: '2.5rem',
    },
  },
}));

export { useStyles };
