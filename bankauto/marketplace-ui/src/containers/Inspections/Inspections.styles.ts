import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, palette: { grey } }) => ({
    root: {
      [down('xs')]: {
        marginTop: '11rem',
      },
    },
    title: {
      [down('xs')]: {
        textAlign: 'center',
      },
    },
    infoTitle: {
      paddingBottom: '0 !important',
      [down('xs')]: {
        textAlign: 'center',
      },
    },
    mainContainer: {
      display: 'flex',
      [down('xs')]: {
        flexDirection: 'column',
      },
    },
    infoSection: {
      [down('xs')]: {
        marginBottom: '2.5rem',
      },
    },
    inspectionsInfoSection: {
      marginTop: '1.25rem',
      [down('xs')]: {
        margin: '0 -1.25rem',
        padding: '1.25rem',
        paddingBottom: '2.5rem',
        backgroundColor: grey['200'],
      },
    },
  }),
  { name: 'InfoItemsWrapper' },
);

export { useStyles };
