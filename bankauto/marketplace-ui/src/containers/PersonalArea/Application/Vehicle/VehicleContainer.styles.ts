import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { grey }, breakpoints: { down } }) => ({
  colorCircle: {
    height: '2rem',
    width: '2rem',
    borderRadius: '50%',
    display: 'inline-block',
    border: `.0625rem solid ${grey[200]}`,
  },
  icon: {
    display: 'flex',
    '& path, & circle, & rect': {
      fill: 'transparent',
    },
    fontSize: '2rem',
  },
  expandIcon: {
    [down('xs')]: {
      margin: '.25rem 1.25rem 0 1rem',
    },
  },
}));

export { useStyles };
