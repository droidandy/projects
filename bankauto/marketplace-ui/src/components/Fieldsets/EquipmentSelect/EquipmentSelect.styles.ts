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
        padding: '1.25rem 0',
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
      buttonActive: {
        background: mainColor,
        color: contrastText,
      },
      withSvg: {
        '& $buttonDefault': {
          '& svg': {
            color: mainColor,
          },
          '&:hover': {
            '& svg': {
              color: 'inherit',
            },
          },
        },
      },
    };
  },
  { name: 'EquipmentRadio' },
);

export { useStyles };
