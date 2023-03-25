import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette: { common, secondary }, breakpoints: { down }, typography: { h1, h3 } }) => {
    return {
      root: {
        position: 'relative',
      },
      imageWrapper: {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        height: '32.5rem',
        width: '100%',
        [down('xs')]: {
          height: '23.5625rem',
          color: common.white,
          textAlign: 'center',
        },
      },
      titleInner: {
        fontSize: h1.fontSize,
        fontWeight: h1.fontWeight,
        lineHeight: h1.lineHeight,
        [down('xs')]: {
          fontSize: h3.fontSize,
          fontWeight: h3.fontWeight,
          lineHeight: h3.lineHeight,
        },
      },
      mainTitle: {
        zIndex: 1,
        color: secondary.contrastText,
        paddingTop: '1rem',
        [down('xs')]: {
          paddingTop: '0rem',
        },
      },
    };
  },
  { name: 'InspectionsHero' },
);
