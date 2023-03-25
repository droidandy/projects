import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    root: {
      position: 'relative',
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
    },
    buttonNext: {
      right: '-4.5rem',
      [down('md')]: {
        right: '-3.5rem',
      },
    },
    buttonPrev: {
      left: '-4.5rem',
      [down('md')]: {
        left: '-3.5rem',
      },
    },
  }),
  {
    name: 'ServiceSlider',
  },
);

export { useStyles };
