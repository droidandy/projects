import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  (theme) => {
    const {
      palette: { background, secondary },
    } = theme;
    return {
      root: {
        padding: '5rem 0',
        overflow: 'hidden',
        backgroundColor: background.paper,
      },
      textBodyWrapper: {
        maxWidth: '45.625rem',
        position: 'relative',
      },
      textContent: {
        overflow: 'hidden',
        paddingBottom: '2.5rem',
        '& p': {
          marginBottom: '.625rem',
        },
      },
      gradient: {
        position: 'absolute',
        height: '5rem',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `linear-gradient(transparent, ${background.paper})`,
      },
      showMoreBtn: {
        borderBottom: `1px dashed ${secondary.main}`,
        cursor: 'pointer',
      },
    };
  },
  { name: 'RobotsTextSection' },
);

export { useStyles };
