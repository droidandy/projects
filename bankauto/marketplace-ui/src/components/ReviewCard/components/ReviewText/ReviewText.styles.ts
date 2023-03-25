import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles(
  ({ palette: { secondary } }) => ({
    featuresContainer: {
      paddingTop: '1.25rem',
    },
    featureTitle: {
      display: 'flex',
      alignItems: 'center',
      paddingBottom: '.25rem',
    },
    featureContent: {
      paddingLeft: '2rem',
    },
    descriptionTitle: {
      borderTop: `1px solid ${secondary.light}`,
      paddingTop: '1rem',
      paddingBottom: '1rem',
    },
  }),
  { name: 'ReviewCardText' },
);
