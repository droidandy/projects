import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, typography, palette: { secondary, text, grey, primary } }) => ({
    controlWrapper: {
      display: 'flex',
      flexDirection: 'row',
      flexGrow: 1,
      marginBottom: '1.25rem',
    },
    inputGroup: {
      flexGrow: 1,
    },
    input: {
      height: '5rem',
      [down('xs')]: {
        border: `0.063rem solid ${grey[200]}`,
        borderRadius: '0.5rem',
        height: '3.75rem',
      },
    },
    link: {
      color: primary.main,
    },
    label: {
      marginTop: '1.875rem',
      marginBottom: '1.25rem',
    },
    btnText: {
      color: secondary.contrastText,
    },
    vehicleHistory: {
      marginBottom: '1.25rem',
    },
    vehicleList: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginLeft: '0.625rem',
      marginTop: -2,
      [down('xs')]: {
        marginTop: 0,
        marginLeft: 0,
      },
    },
    vehicleButton: {
      padding: 0,
      fontWeight: 700,
      minWidth: 'auto',
      [down('xs')]: {
        fontSize: '0.875rem',
      },
    },
    showMoreButtonContainer: {
      flexShrink: 0,
    },
    showMoreButton: {
      fontWeight: 700,
      [down('xs')]: {
        fontSize: '0.875rem',
        padding: 0,
      },
    },
    manualButton: {
      [down('xs')]: {
        fontSize: '0.875rem',
        marginLeft: '0.875rem',
      },
    },
    submitButton: {
      marginBottom: '1.25rem',
    },
  }),
  { name: 'VehicleNumberChecker' },
);

export { useStyles };
