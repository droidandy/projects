import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette, zIndex }) => ({
    headerBar: {
      zIndex: zIndex.drawer + 1,
    },
    headerTransparent: {
      '& $desktopLink': {
        color: palette.common.white,
        '&:hover': {
          color: palette.common.white,
        },
        '&:hover:after': {
          opacity: 1,
        },
      },
      '& $profileButtonText': {
        color: palette.common.white,
      },
    },
    desktopLink: {
      display: 'block',
      position: 'relative',
      paddingTop: '.5rem',
      paddingBottom: '.5rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '.0625rem',
      '&:after': {
        content: '""',
        position: 'absolute',
        opacity: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '0.125rem',
        background: palette.common.white,
        transition: 'all .2s ease-in',
      },
      '&:hover': {
        color: palette.primary.main,
      },
      '&:hover:after': {
        opacity: 0,
      },
      '&.active:after': {
        opacity: 1,
      },
    },
    desktopLinkWhite: {
      borderStyle: 'solid',
      borderBottom: '1px',
      borderColor: 'white',
    },
    advancedLink: {
      fontWeight: 600,
      '&:hover': {
        color: palette.text.primary,
      },
    },
    profileButtonText: {
      color: palette.text.primary,
      fontSize: '1rem',
    },
    profileButton: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  }),
  { name: 'MKP-Header' },
);

export { useStyles };
