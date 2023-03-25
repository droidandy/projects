import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { common } }) => ({
  text: {
    color: common.white,
    textAlign: 'center',
  },
  icon: {
    fill: 'none',
    height: '3rem',
    width: '3rem',
  },
}));

export { useStyles };
