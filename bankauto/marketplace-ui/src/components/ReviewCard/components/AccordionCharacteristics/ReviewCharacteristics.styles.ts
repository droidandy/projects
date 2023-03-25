import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles(
  ({ breakpoints: { down }, palette: { secondary } }) => ({
    characteristicTitle: {
      borderTop: `1px solid ${secondary.light}`,
      paddingTop: '1rem',
      paddingBottom: '1rem',
    },
    accordionDetailsRoot: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      paddingRight: '',
      padding: '0 8.125rem 0 0',
      [down('xs')]: {
        padding: 0,
      },
    },

    item: {
      display: 'flex',
      justifyContent: 'space-between',
      flexBasis: '38%',
      paddingBottom: '1.625rem',
      [down('xs')]: {
        flexBasis: '100%',
      },
    },
  }),
  { name: 'ReviewCardReviewCharacteristics' },
);
