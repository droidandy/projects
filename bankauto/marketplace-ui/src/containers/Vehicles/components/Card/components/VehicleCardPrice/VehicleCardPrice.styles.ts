import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      common: { white },
    },
  }) => {
    return {
      root: {
        display: 'flex',
        flexDirection: 'column',
      },
      actualPrice: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      hidden: {
        visibility: 'hidden',
      },
      oldPriceDecoration: {
        textDecoration: 'line-through',
      },
      infoColor: {
        color: white,
      },
      shevron: {
        display: 'none',
        transform: 'rotate(90deg)',
      },
    };
  },
);

export { useStyles };
