import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ typography: { h5 } }) => {
  return {
    iconButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      padding: '.625rem',
      zIndex: 20,
    },
    icon: {
      height: '2.5rem',
      width: '2.5rem',
    },
    title: {
      padding: '0.75rem 2.125rem 0.875rem 1.25rem',
    },
    teaserItem: {
      paddingBottom: '0.75rem',
      '&:last-of-type': {
        paddingBottom: '1.25rem',
      },
    },
    teaserButton: {
      fontSize: h5.fontSize,
      lineHeight: h5.lineHeight,
      fontWeight: h5.fontWeight,
    },
    infoRoot: {
      padding: '1rem 1.25rem 1.25rem 1.25rem',
    },
  };
});

export { useStyles };
