import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      background,
      common: { white, black },
      grey,
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
        },
      },
      galleryTopParent: {
        height: '100%',
        width: '100%',
      },
      paginationBullet: {
        height: '1rem',
        width: '1rem',
        backgroundColor: 'red',
      },
      sliderBox: {
        width: '100%',
        height: 'auto',
        position: 'relative',
      },
      galleryTop: {
        borderRadius: '.5rem',
        width: 'auto',
        height: '32.5rem',
        marginBottom: '0.625rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 .5rem 3rem rgba(0, 0, 0, .1)',
        backgroundColor: 'transparent',
        '& .swiper-button-prev.custom, & .swiper-button-next.custom': {
          height: '2.5rem',
          width: '2.5rem',
          top: '50%',
          transform: 'tralateX(-50%)',
          display: 'none',
        },
        '&:hover .swiper-button-prev.custom, &:hover .swiper-button-next.custom': {
          display: 'block',
        },
        '& .swiper-button-prev.custom': {
          left: '1.875rem',
          right: 'unset',
        },
        '& .swiper-button-next.custom': {
          right: '1.875rem',
          left: 'unset',
        },
        '& .swiper-button-prev.custom:after, & .swiper-button-next.custom:after': {
          content: '""',
          color: black,
          backgroundColor: white,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1rem 1rem',
          backgroundPosition: '60% center',
          height: '2.5rem',
          width: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '.5rem',
          borderRadius: '.25rem',
          lineHeight: 1,
          boxShadow: '0 .5rem 3rem rgba(0, 0, 0, .1)',
          transition: 'all .1s linear',
        },
        '& .swiper-button-prev.custom:hover:after, & .swiper-button-next.custom:hover:after': {
          backgroundColor: black,
          opacity: '.7',
        },
        '& .swiper-button-next.custom:active:after, & .swiper-button-prev.custom:active:after': {
          backgroundColor: black,
          opacity: 1,
        },
        '& .swiper-button-prev.custom:hover:after, & .swiper-button-prev.custom:active:after': {
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.02012 12.018L2.00006 7.01774L7.0211 2.00334' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A\")",
        },
        '& .swiper-button-next.custom:hover:after, & .swiper-button-next.custom:active:after': {
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.00783 12.018L12.0279 7.01774L7.00686 2.00334' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A\")",
        },
        '& .swiper-button-next.custom:after': {
          backgroundPosition: '40% center',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.00783 12.018L12.0279 7.01774L7.00686 2.00334' stroke='%23222222' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A\")",
        },
        '& .swiper-button-prev.custom:after': {
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.02012 12.018L2.00006 7.01774L7.0211 2.00334' stroke='%23222222' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A\")",
        },
        '& [class*=galleryImage]': {
          boxShadow: '0 .5rem 3rem rgba(0, 0, 0, .1)',
        },
      },
      galleryTopVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        background: grey[200],
        display: 'none',
      },
      galleryTopVideoVisible: {
        display: 'block',
      },
      thumbParent: {
        backgroundColor: background.default,
        overflow: 'hidden',
        height: '3.25rem',
        display: 'flex',
        alignItems: 'stretch',
        '& img': {
          maxWidth: 'unset',
        },
        '& > *': {
          overflow: 'hidden',
        },
      },
      galleryThumbnails: {
        height: '100%',
        overflow: 'hidden',
        flexGrow: 1,
        position: 'relative',
        backgroundColor: background.default,
        margin: '0 1.75rem 0 1.75rem',
        '& > *:not(:first-child)': {
          display: 'none',
        },
        '& .swiper-wrapper > div': {
          height: 'calc(100% - 0.125rem)',
          border: `.0625rem solid ${grey[200]}`,
          maxWidth: '5rem',
          borderRadius: '.25rem',
          '&.swiper-slide-active': {
            position: 'relative',
            zIndex: 1,
            '&:after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(0deg, rgba(34, 34, 34, 0.2), rgba(34, 34, 34, 0.2))',
              zIndex: 2,
              borderRadius: '.25rem',
            },
          },
        },
      },
      galleryThumbnailsLoop: {
        '& .swiper-wrapper': {
          marginLeft: 'calc(-50% + 2.6rem)',
        },
      },
      galleryTopZoom: {
        position: 'absolute',
        boxShadow: '0 .5rem 3rem rgba(0, 0, 0, .1)',
        top: '1rem',
        right: '1rem',
        height: '2.5rem',
        width: '2.5rem',
        padding: '.585rem',
        lineHeight: 0,
        cursor: 'pointer',
        backgroundColor: white,
        outline: 'none',
        border: 'none',
        borderRadius: '50%',
        zIndex: 1,
        '& path': {
          fill: 'none',
        },
      },
      galleryImage: {
        position: 'relative',
        borderRadius: '.5rem',
      },

      thumbVideo: {
        width: '5rem',
        height: '100%',
        marginRight: '.5rem',
        cursor: 'pointer',
        '&:hover $iconPlayWrapper': {
          opacity: 0.7,
        },
      },
      zoomInIcon: {
        fontSize: '1.2rem',
      },
      iconPlayWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '1.25rem',
        height: '1.25rem',
        borderRadius: '0.25rem',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: white,
        textAlign: 'center',
        transition: 'all .2s ease-in',
        '& > *': {
          fontSize: '0.625rem',
        },
      },
      thumbControl: {
        position: 'absolute',
        display: 'block',
        top: 0,
        bottom: 0,
        width: '2rem',
        cursor: 'pointer',
        background: 'no-repeat center',
        '&.swiper-button-disabled': {
          opacity: 0.35,
        },
      },
      thumbPrev: {
        left: '0rem',
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.02012 12.018L2.00006 7.01774L7.0211 2.00334' stroke='%23222222' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A\")",
      },
      thumbNext: {
        right: '0rem',
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.00783 12.018L12.0279 7.01774L7.00686 2.00334' stroke='%23222222' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A\")",
      },
      bestPriceImage: {
        position: 'absolute',
        top: '1.25rem',
        left: '1.25rem',
        zIndex: 10,
        width: '13rem',
        height: '13rem',
      },
    };
  },
  { name: 'Gallery' },
);

export { useStyles };
