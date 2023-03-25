import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette, breakpoints: { down } }) => ({
  root: {
    boxShadow: '0rem 0.25rem 3rem rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    zIndex: 10,
    '&:after': {
      position: 'absolute',
      content: "''",
      width: '100%',
      height: '0.625rem',
      bottom: 0,
      backgroundColor: palette.primary.main,
    },
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: '1.25rem',
    maxWidth: '100%',
    width: '100%',
    height: '10.25rem',
    [down('xs')]: {
      height: 'calc(100vw /1.95)',
    },
  },
  image: {
    maxWidth: '100%',
    objectFit: 'contain',
  },
}));
export { useStyles };
