import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { primary, common }, breakpoints: { down } }) => ({
    slide: {
      position: 'relative',
      width: '100%',
      height: '18rem',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      cursor: 'pointer',
      backgroundColor: common.black,
      [down('xs')]: {
        height: '14.25rem',
      },
    },
    mainImg: {
      opacity: 0.6,
      width: '100%',
    },
    title: {
      position: 'absolute',
      bottom: '1.25rem',
      left: '1.25rem',
      right: '1.25rem',
      fontWeight: 'bold',
      color: primary.contrastText,
      maxHeight: '4.5rem',
      overflow: 'hidden',
    },
  }),
  {
    name: 'SpecialProgramsSlide',
  },
);

export { useStyles };
