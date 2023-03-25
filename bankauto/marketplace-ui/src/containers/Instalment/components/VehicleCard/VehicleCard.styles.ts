import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down } }) => {
    return {
      root: {
        boxSizing: 'border-box',
        padding: '0.625rem',
        borderRadius: '1rem',
        transition: 'box-shadow 0.2s',
        borderStyle: 'solid',
        borderColor: 'transparent',
        borderWidth: '0.5px',
        '&:hover': {
          borderColor: '#E8E8E8',
        },
      },
      slider: {
        position: 'relative',
        width: '100%',
        height: '15.375rem',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        '&:after': {
          position: 'absolute',
          background: 'rgba(0,0,0,0.08)',
          borderRadius: '0.5rem',
          content: '""',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
        },
        '&.defaultImage::after': {
          background: 'none',
        },
        [down('xs')]: {
          '& .swiper-wrapper .swiper-slide': {
            height: '100%',
          },
          height: '14.25rem',
          '&:after': {
            display: 'none',
          },
        },
      },
      mobileSlider: {
        height: '100%',
        overflow: 'hidden',
        '& img': {
          position: 'absolute',
        },
        '& div': {
          height: '100%',
        },
      },
      mobileSliderItem: {
        position: 'relative',
        '&:after': {
          position: 'absolute',
          background: 'rgba(0,0,0,0.08)',
          borderRadius: '0.5rem',
          content: '""',
          width: '100%',
          height: '100%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
        '&.defaultImage::after': {
          background: 'none',
        },
      },
      labels: {
        position: 'absolute',
        padding: '0.625rem 0 0 1.25rem',
        background: 'transparent',
        width: 'auto',
        top: 0,
        left: 0,
        zIndex: 1,
      },
      labelsItem: {
        paddingTop: '0.625rem',
      },
      carDataWrapper: {
        maxWidth: '100%',
      },
    };
  },
  { name: 'Instalment-VehicleCard' },
);

export { useStyles };
