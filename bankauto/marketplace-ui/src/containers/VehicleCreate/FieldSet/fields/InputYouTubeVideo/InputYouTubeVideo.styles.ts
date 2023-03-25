import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down } }) => {
    return {
      root: {
        [down('xs')]: {},
      },
      input: {
        [down('xs')]: {
          '& $caption': {
            display: 'none',
          },
        },
      },
      caption: {},
      preview: {
        borderRadius: '0.25rem',
        width: '6.525rem',
        height: '3.75rem',
        overflow: 'hidden',
        position: 'relative',
      },
    };
  },
  { name: 'InputYouTubeVideo' },
);

export { useStyles };
