import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down } }) => {
    return {
      imageContainer: {
        position: 'relative',
        width: '100%',
        height: '13.75rem',
        borderRadius: '0.5rem',
        '& div': {
          borderRadius: '0.5rem',
          overflow: 'hidden',
        },
        [down('xs')]: {
          height: '14.25rem',
          '&:after': {
            display: 'none',
          },
        },
      },
    };
  },
  { name: 'BlogPost' },
);

export { useStyles };
