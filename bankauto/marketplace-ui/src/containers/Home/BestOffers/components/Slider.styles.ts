import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    root: {
      padding: 0,
      '& button': {
        padding: 0,
        paddingBottom: '0.625rem',
        opacity: 1,
      },
      '& button > span': {
        opacity: '1 !important',
      },
      [down('xs')]: {
        '& button:not(:last-of-type)': {
          marginRight: '1rem',
        },
      },
      '& span': {
        height: '3px',
        zIndex: 1,
      },
    },
    divider: {
      position: 'relative',
      top: '-1px',
    },
    sliderTitle: {
      [down('xs')]: {
        width: '70%',
      },
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
    name: 'BestOffersSlider',
  },
);

export { useStyles };
