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
      },
      additionWrapper: {
        color: primary,
      },
      titleColor: {
        color: white,
      },
      item: {
        padding: '0.125rem 0.5rem',
        fontSize: '0.875em',
        lineHeight: '0.875rem',
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
