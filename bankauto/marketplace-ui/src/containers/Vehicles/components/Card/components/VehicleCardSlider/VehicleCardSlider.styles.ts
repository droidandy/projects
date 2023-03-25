import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles<Theme>(
  ({
    palette: {
      primary: { main },
      common: { white },
    },
    breakpoints: { down },
  }) => ({
    root: {
      maxWidth: '100%',
      height: '100%',
    },
    sliderContainer: {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      height: '100%',
    },
    sliderTrack: {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    sliderItem: {
      maxWidth: '100%',
      position: 'relative',
      overflow: 'hidden',
      width: '0',
      height: '100%',
      transform: 'translateX(100%)',
      backfaceVisibility: 'hidden',
      '&.active': {
        width: '100%',
        transform: 'translateX(0)',
        '& > img': {
          maxWidth: '100%',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        },
      },
    },
    hoverDotsContainer: {
      width: '100%',
      position: 'absolute',
      display: 'flex',
      flexFlow: 'row nowrap',
      height: '100%',
      top: 0,
      zIndex: 1,
    },
    hoverDot: {
      height: '100%',
    },
    dotsContainer: {
      outline: 'none',
      width: '100%',
      position: 'absolute',
      content: '""',
      bottom: '0.75rem',
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0,
      zIndex: 1,
      transition: 'opacity .2s ease-in',
      '&.active': {
        opacity: 1,
      },
      '&*': {
        outline: 'none',
      },
    },
    dot: {
      maxWidth: '3.125rem',
      margin: '0 0.3125rem',
      borderRadius: '1rem',
      transition: 'all .2s ease-in',
      height: '2px',
      background: white,
      '&.active': {
        background: main,
      },
      '&:first-of-type': {
        marginLeft: '0.625rem',
      },
      '&:last-of-type': {
        marginRight: '0.625rem',
      },
      [down('xs')]: {
        maxWidth: '1.25rem',
      },
    },
  }),
  { name: 'ItemsCarousel' },
);
