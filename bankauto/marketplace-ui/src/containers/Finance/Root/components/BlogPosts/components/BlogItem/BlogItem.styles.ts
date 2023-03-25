import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { primary, common }, breakpoints: { down } }) => ({
    title: {
      position: 'absolute',
      bottom: '1.25rem',
      left: '1.25rem',
      right: '1.25rem',
      fontWeight: 'bold',
      color: primary.contrastText,
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: '13.75rem',
      backgroundColor: common.black,
      borderRadius: '0.5rem',
      '& div > div': {
        borderRadius: '0.5rem',
        overflow: 'hidden',
      },
      '& img': {
        opacity: 0.6,
      },
      [down('xs')]: {
        height: '14.25rem',
        '&:after': {
          display: 'none',
        },
      },
    },
  }),
  { name: 'BlogPost' },
);

export { useStyles };
