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
      marginBottom: '0.625rem',
      [down('xs')]: {
        marginTop: '1.25rem',
        marginBottom: '0rem',
        ...typography.h5,
      },
    },
    item: {
      width: '100%',
    },
    container: {
      marginTop: '1.25rem',
      marginBottom: '1.25rem',
    },
  }),
  { name: 'AdditionalInformation' },
);

export { useStyles };
