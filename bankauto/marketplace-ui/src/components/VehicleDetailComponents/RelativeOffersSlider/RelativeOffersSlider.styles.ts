import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  () => ({
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
    },
    buttonNext: {
      right: '-3.5rem',
    },
    buttonPrev: {
      left: '-3.5rem',
    },
  }),
  {
    name: 'RelativesSlider',
  },
);

export { useStyles };
