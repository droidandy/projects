import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette, zIndex }) => ({
    headerBar: {
      zIndex: zIndex.drawer + 1,
      boxShadow: '0px .5rem 3rem rgba(0, 0, 0, .1)',
    },
    withoutShadow: {
      boxShadow: 'none',
    },
    toolbar: {
      justifyContent: 'center',
    },
    transparentBurger: {
      '& rect': {
        fill: palette.background.paper,
      },
      '& path': {
        fill: palette.background.paper,
      },
    },
    logo: {
      marginTop: '.25rem',
    },
    link: {
      fontSize: '.875rem',
      fontWeight: 700,
    },
    subLink: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: '2.5rem',
    },
    burger: {
      position: 'absolute',
      right: '.1875rem',
      top: '.625rem',
    },
    profileButtonText: {
      color: palette.text.primary,
      fontSize: '1rem',
    },
  }),
  { name: 'MKP-Header' },
);

export { useStyles };
