import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      primary: { contrastText },
      grey,
      text: { primary: textPrimary },
    },
  }) => {
    const mainColor = grey[500];
    return {
      title: {
        paddingBottom: '1.25rem',
      },
      root: {},
      button: {
        padding: '.375rem .625rem .625rem',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: mainColor,
        borderRadius: '0.5rem',
        background: 'transparent',
        textAlign: 'center',
        cursor: 'pointer',
        '&:hover': {
          background: mainColor,
        },
      },
      buttonDefault: {
        color: textPrimary,
        '&:hover': {
          color: contrastText,
        },
      },
      buttonDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      buttonActive: {
        background: mainColor,
        color: contrastText,
      },
    };
  },
  { name: 'Stickers' },
);

export { useStyles };
