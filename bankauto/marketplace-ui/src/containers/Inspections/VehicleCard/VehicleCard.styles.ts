import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, palette: { grey } }) => ({
    root: {
      padding: '1.25rem 1.0625rem 1.5rem 1.0625rem',
      borderRadius: '0.5rem',
      border: `0.0625rem solid ${grey['200']}`,
      marginTop: '4.125rem',
      position: 'sticky',
      top: '1rem',
      [down('xs')]: {
        border: 'none',
        padding: 0,
        marginTop: 0,
      },
    },
    imageContainer: {
      position: 'relative',
      height: '13.75rem',
      width: '100%',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      overflow: 'hidden',
      '&::after': {
        content: "''",
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(2, 2, 2, 0.08)',
      },
      [down('xs')]: {
        marginBottom: '1.25rem',
      },
    },
    inspectionInfoWrapper: {
      paddingTop: '0.625rem',
      paddingBottom: '1.25rem',
      borderBottom: `0.0625rem solid ${grey['200']}`,
    },
    chipsWrapper: {
      paddingTop: '0.625rem',
    },
    mainButton: {
      marginTop: '1.25rem',
    },
    secondButton: {
      marginTop: '0.875rem',
    },
    choiceButton: {
      marginTop: '0.875rem',
      marginBottom: '1.25rem',
      [down('xs')]: {
        marginTop: '0.625rem',
      },
    },
  }),
  { name: 'VehicleCard' },
);

export { useStyles };
