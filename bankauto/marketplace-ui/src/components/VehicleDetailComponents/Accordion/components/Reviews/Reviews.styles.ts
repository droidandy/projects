import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  {
    pagination: {
      paddingTop: '2.5rem',
    },
    emptyReviewListMessage: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    createReviewButton: {
      padding: '0.375rem 0.25rem',
    },
  },
  {
    name: 'Reviews',
  },
);
