import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      primary: { main },
      common: { white },
      text: { primary },
    },
  }) => {
    return {
      root: {
        border: `0.5px solid ${main}`,
        borderRadius: '0.25rem',
        background: white,
      },
      titleWrapper: {
        background: main,
        color: `${white} !important`,
        width: '100%',
      },
      additionWrapper: {
        color: primary,
      },
      titleColor: {
        color: white,
      },
      item: {
        width: 'auto',
        padding: '0.125rem 0.5rem',
        fontSize: '0.625em',
        lineHeight: '0.875rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
