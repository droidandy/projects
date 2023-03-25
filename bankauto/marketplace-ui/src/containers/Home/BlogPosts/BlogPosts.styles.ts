import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  () => {
    return {
      mobileSlider: {
        '& img': {
          position: 'absolute',
        },
      },
      mobileSliderItem: {
        position: 'relative',
      },
    };
  },
  { name: 'BlogSection' },
);

export { useStyles };
