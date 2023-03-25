import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(
  ({
    palette: {
      error: { main },
      common: { white },
    },
  }) => {
    return {
      root: {
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
      item: {
        width: '100%',
        padding: '0.125rem 0.5rem',
        fontSize: '0.625em',
        lineHeight: '0.875rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: white,
        background: main,
        border: `0.5px solid ${main}`,
        borderRadius: '0.25rem',
        marginTop: '0.625rem',
        '& > span': {
          lineHeight: '0.875rem',
          verticalAlign: 'middle',
          letterSpacing: '0.0625rem',
        },
      },
    };
  },
);

export { useStyles };
