import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      primary: { main },
    },
  }) => {
    return {
      imageContainer: {
        '&:after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          background: 'rgba(0, 0, 0, 0.08)',
          borderRadius: '0.5rem',
        },
      },
      galleryTopParent: {
        height: '100%',
        width: '100%',
        padding: '0 1.25rem',
        position: 'relative',
      },
      sliderBox: {
        width: '100%',
        height: 'auto',
        position: 'relative',
        overflow: 'hidden',
      },
      galleryTop: {
        borderRadius: '.5rem',
        width: 'auto',
        position: 'relative',
        backgroundColor: 'transparent',
        minHeight: '9.75rem',
        height: '50vw',
        overflow: 'unset',
      },
      galleryImage: {
        position: 'relative',
        borderRadius: '.5rem',
        overflow: 'hidden',
      },
      iconPlayWrapper: {
        position: 'absolute',
        right: '1.375rem',
        bottom: '0rem',
        zIndex: 1,
      },
      availableChip: {
        position: 'absolute',
        top: '0.875rem',
        left: '2.125rem',
        background: main,
        padding: '0 0.625rem',
        borderRadius: '0.25rem',
        zIndex: 2,
        '& > *': {
          fontWeight: 700,
        },
      },
      bestPriceImage: {
        position: 'absolute',
        top: '0.625rem',
        left: '1.225rem',
        zIndex: 10,
        width: '6.25rem',
        height: '6.25rem',
      },
      galleryTopVideo: {
        position: 'absolute',
        top: '25%',
      },
    };
  },
  { name: 'Gallery' },
);

export { useStyles };
