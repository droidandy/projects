import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette: { common, secondary }, breakpoints: { down } }) => {
    return {
      imageWrapper: {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        height: '35rem',
        width: '100%',
        [down('xs')]: {
          height: '23.5625rem',
          color: common.white,
          textAlign: 'center',
          '& .titleInner': {
            paddingBottom: '0.625rem',
          },
        },
      },
      mainTitle: {
        zIndex: 1,
        color: common.black,
        transform: 'translateY(-6.55rem)',
        marginTop: '6.25rem',
        [down('xs')]: {
          display: 'flex',
          transform: 'none',
          color: secondary.contrastText,
          marginTop: 0,
          height: '100%',
          '&>div': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
          },
        },
      },
      texts: {
        [down('xs')]: {
          paddingTop: '5.625rem',
          display: 'flex',
          flexDirection: 'column',
        },
      },
      button: {
        padding: '3.75rem 0rem 0rem',
        margin: 'inherit',
        [down('xs')]: {
          padding: '0 0 1.25rem 0',
          '& button': {
            width: '100%',
            minWidth: '17.5rem',
            minHeight: '3.125rem',
            padding: 0,
          },
        },
      },
    };
  },
  { name: 'LandingHero' },
);
