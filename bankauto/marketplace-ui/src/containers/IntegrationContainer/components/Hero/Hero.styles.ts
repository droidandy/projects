import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette: { common, secondary }, breakpoints: { down }, typography }) => {
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
        },
      },
      mainTitle: {
        zIndex: 1,
        color: secondary.contrastText,
      },
      link: {
        color: common.white,
        ...typography.h5,
        position: 'relative',
        '&:after': {
          content: '"/"',
          margin: '0 1.5rem',
        },
      },
      linksContainer: {
        marginTop: '2rem',
        display: 'flex',
        '& >span:not(:first-child)': {
          opacity: 0.5,
        },
      },
    };
  },
  { name: 'IntegrationHero' },
);
