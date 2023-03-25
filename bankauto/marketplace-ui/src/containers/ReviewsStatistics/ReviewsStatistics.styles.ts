import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette: { secondary, primary } }) => ({
    root: {
      position: 'sticky',
      top: '6rem',
    },
    statisticsContainer: {
      border: `1px solid ${secondary.light}`,
      borderRadius: '0.5rem',
      marginBottom: '1.25rem',
    },
    ratingWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.25rem',
    },
    reviewStatisticListWrapper: {
      padding: '1.25rem',
      paddingBottom: '0.625rem',
      borderTop: `1px solid ${secondary.light}`,
    },
    reviewStatistic: {
      paddingBottom: '0.625rem',
    },
    reviewStatisticDesc: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: '0.625rem',
    },
    progressBar: {
      height: '0.25rem',
      borderRadius: '0.125rem',
      backgroundColor: secondary.light,
    },
    progressStatus: {
      height: '100%',
      borderRadius: '0.125rem',
      backgroundColor: primary.main,
    },
  }),
  { name: 'ReviewsStatistics' },
);
