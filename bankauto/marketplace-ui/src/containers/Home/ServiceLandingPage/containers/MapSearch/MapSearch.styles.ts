import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, typography, palette: { text, grey } }) => ({
    control: {
      border: `0.063rem solid ${grey[200]}`,
      borderRadius: '0.5rem',
      height: '5rem',
      [down('xs')]: {
        height: '3.75rem',
      },
    },
    label: {
      ...typography.h4,
      color: text.primary,
      marginTop: '1.875rem',
      marginBottom: '1.875rem',
      [down('xs')]: {
        marginTop: '1.25rem',
        marginBottom: '0.625rem',
        ...typography.h5,
      },
    },
    btn: {
      marginTop: '2.5rem',
      [down('xs')]: {
        marginTop: '1rem',
      },
    },
    item: {
      width: '100%',
    },
    radius: {
      marginTop: '1.875rem',
      marginBottom: '1.25rem',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      [down('xs')]: {
        marginTop: '0.625rem',
        marginBottom: '0rem',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',
      },
    },
    rLeft: {
      [down('xs')]: {
        marginBottom: '0.625rem',
      },
    },
    radiusLabel: {
      ...typography.h5,
      color: text.primary,
    },
    countLabel: {
      ...typography.body2,
      color: text.primary,
    },
    containerRadius: {
      display: 'flex',
      flexDirection: 'row',
      padding: '0.375rem',
      background: grey[200],
      borderRadius: '0.5rem',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      [down('xs')]: {
        width: '100%',
      },
    },
  }),
  { name: 'MapSearch' },
);

export { useStyles };
