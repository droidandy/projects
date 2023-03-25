import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      primary,
      grey,
      text: { primary: textPrimary },
    },
  }) => {
    const mainColor = grey[500];
    const contrastColor = primary.contrastText;
    return {
      root: {
        width: 'calc(100% + 2rem)',
        margin: '-1rem',
        border: 0,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        padding: 0,
      },
      label: {
        flexGrow: 0,
        maxWidth: '20%',
        flexBasis: '20%',
        padding: '1rem',
      },
      button: {
        display: 'block',
        width: '100%',
        padding: '0.375rem 0.5rem 0.675rem',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: mainColor,
        borderRadius: '0.5rem',
        color: textPrimary,
        background: 'transparent',
        textAlign: 'center',
        cursor: 'pointer',
        height: '100%',
        '&:hover': {
          background: mainColor,
          color: contrastColor,
          fontWeight: 600,
        },
        '&:hover .years': {
          fontWeight: 400,
        },
        '&:hover svg > path': {
          fill: `${contrastColor} !important`,
        },
      },
      buttonActive: {
        background: mainColor,
        color: contrastColor,
        fontWeight: 600,
        '& svg > path': {
          fill: `${contrastColor} !important`,
        },
        '& .years': {
          fontWeight: 400,
        },
      },
      input: {
        display: 'none',
      },
    };
  },
  { name: 'EquipmentRadio' },
);

export { useStyles };
