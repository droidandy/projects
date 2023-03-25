import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    specialProgramsContainer: {
      padding: '2.5rem 0 ',
      [down('xs')]: {
        padding: ' 1.25rem 0  1.25rem 0.625rem',
      },
    },
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
    header: {
      marginBottom: '2.5rem',
      [down('xs')]: {
        marginBottom: '1.25rem',
      },
    },
    swiperWrapper: {
      '& .swiper-wrapper': {
        justifyContent: 'center',
      },
    },
  }),
  {
    name: 'SpecialProgramsSlider',
  },
);

export { useStyles };
