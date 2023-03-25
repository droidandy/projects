import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, palette: { warning, error } }) => {
    return {
      root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '0.625rem',
        borderRadius: '1rem',
        transition: 'box-shadow 0.2s',
        borderStyle: 'solid',
        borderColor: 'transparent',
        borderWidth: '1px',
        '&:hover': {
          boxShadow: '0rem 0.5rem 3rem rgba(0, 0, 0, 0.1)',
        },
        [down('xs')]: {
          '&:hover': {
            borderColor: 'transparent',
          },
        },
      },
      overlay: {
        '&:after': {
          content: '""',
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255,255,255,0.5)',
          pointerEvents: 'none',
          zIndex: 1,
          [down('xs')]: {
            zIndex: 1,
          },
        },
      },
      imageErrorBackground: {
        '& > div:first-of-type': {
          backgroundColor: 'rgba(0, 0, 0, 0.16)',
        },
      },
      sliderHover: {
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
      },
      slider: {
        position: 'relative',
        width: '100%',
        height: '15.375rem',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        [down('xs')]: {
          '& .swiper-wrapper .swiper-slide': {
            height: '100%',
          },
          height: '14.25rem',
        },
      },
      sliderContainer: {
        position: 'relative',
        width: '100%',
        height: '14.125rem',
      },
      swiperWrapper: {
        position: 'absolute',
        height: '14.125rem',
        width: 'calc(100% + 1rem)',
      },
      imageLabel: {
        position: 'absolute',
        padding: '0.625rem 0 0 0.625rem',
        background: 'transparent',
        width: 'auto',
        top: 0,
        left: 0,
        zIndex: 1,
      },
      imageLabelItem: {
        position: 'relative',
        width: '6.25rem',
        height: '6.25rem',
      },
      labels: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        padding: '0.625rem 0 0 1.25rem',
        background: 'transparent',
        width: 'auto',
        top: 0,
        left: 0,
        zIndex: 5,
      },
      deleteIconWrapper: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 5,
        margin: '.5rem',
        cursor: 'pointer',
      },
      stickersContainer: {
        position: 'absolute',
        background: 'transparent',
        padding: '1.25rem 1.25rem 1.25rem',
        top: 0,
        left: 0,
        zIndex: 5,
        width: '100%',
        [down('xs')]: {
          position: 'relative',
          padding: 0,
          marginTop: '0.625rem',
          overflow: 'hidden',
        },
      },
      labelsItem: {
        paddingTop: '0.625rem',
        width: 'fit-content',
      },
      specialOfferLabel: {
        minWidth: '12.0625rem',
      },
      c2cSoldLabel: {
        background: error.main,
      },
      specialOfferPercent: {
        minWidth: '2.9375rem',
        textAlign: 'center',
      },
      carDataWrapper: {
        maxWidth: '100%',
      },
      wrapper: {
        overflowX: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        '&::scrollbar': {
          display: 'none',
        },
        [down('xs')]: {
          '& > .MuiGrid-item': {
            minWidth: '96%',
          },
        },
      },
      imageRoot: {
        width: '100%',
        height: '14.125rem',
        borderRadius: '0.5rem',
        position: 'relative',
        overflow: 'hidden',
        [down('xs')]: {
          '&:not(:last-child)': {
            marginRight: '0.25rem',
          },
        },
      },
      warningButton: {
        background: warning.main,
        '&:hover': {
          background: warning.dark,
        },
      },
    };
  },
  { name: 'VehicleCard' },
);

export { useStyles };
