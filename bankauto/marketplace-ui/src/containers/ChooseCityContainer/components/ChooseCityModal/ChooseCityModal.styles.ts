import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette,
    palette: {
      common: { black },
      secondary: { light, contrastText },
      primary: { main },
    },
    breakpoints: { down },
  }) => ({
    modal: {
      position: 'relative',
      boxShadow: '0rem 0.5rem 3rem rgba(0, 0, 0, 0.1)',
      borderRadius: '0.5rem',
      height: '40rem',
      minWidth: '31.25rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      [down('xs')]: {
        height: '100%',
        width: '100%',
        minWidth: 'inherit',
      },
    },
    title: {
      fontWeight: 700,
    },
    closeIcon: {
      fontSize: '1rem',
    },
    closeIconBox: {
      position: 'absolute',
    },
    filterInput: {
      '& input': {
        padding: '1.125rem 0',
      },
    },
    list: {
      overflowY: 'auto',
    },
    listItem: {
      padding: '0.25rem 0rem',
      color: black,
      '&:hover': {
        backgroundColor: '#F8F8F8',
      },
      [down('xs')]: {
        padding: '1.125rem 0rem',
      },
    },
    listItemText: {
      '&:hover': {
        color: palette.primary.main,
      },
    },
    message: {
      color: palette.error.main,
    },
    endAdornment: {
      position: 'absolute',
      zIndex: 4,
      right: 0,
    },
    input: {
      position: 'relative',
    },
    iconButton: {
      '&:hover': {
        backgroundColor: '#fff',
      },
    },

    radiusSelectRoot: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      paddingBottom: '.375rem',
    },
    radiusSelectLabel: {
      fontWeight: 700,
      paddingBottom: '.625rem',
    },
    radiusSelectOptionsContainer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: light,
      borderRadius: '.5rem',
      height: '2.5rem',
      padding: '.375rem',
    },
    radiusItem: {
      flexGrow: 1,
      border: 'none',
      backgroundColor: 'transparent',
      height: '100%',
      cursor: 'pointer',
      width: '3.125rem',
    },
    radiusItemActive: {
      borderRadius: '.25rem',
      backgroundColor: main,
      color: contrastText,
    },
  }),
);
export { useStyles };
