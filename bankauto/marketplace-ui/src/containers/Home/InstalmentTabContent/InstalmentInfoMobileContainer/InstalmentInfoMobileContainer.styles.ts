import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { secondary } }) => ({
    root: {
      paddingRight: 0,
      paddingLeft: 0,
    },
    slide: {
      height: '12.5rem',
      background: secondary.light,
      borderRadius: '0.5rem',
      boxSizing: 'border-box',
    },
  }),
  {
    name: 'InstalmentInfoMobileContainer',
  },
);

export { useStyles };
