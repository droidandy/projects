import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ typography, palette: { common, primary } }) => {
    return {
      root: {
        display: 'flex',
      },
      rating: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: common.white,
        backgroundColor: primary.main,
        width: '1.875rem',
        height: '1.875rem',
        borderRadius: '0.5rem',
      },
      ratingValue: {
        fontWeight: typography.fontWeightBold,
      },
      review: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '0.625rem',
      },
      reviewCount: {
        fontWeight: typography.fontWeightBold,
      },
    };
  },
  { name: 'UserReview' },
);

export { useStyles };
