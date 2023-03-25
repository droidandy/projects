import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      common: { white },
    },
  }) => {
    return {
      hidden: {
        visibility: 'hidden',
      },
      title: { fontWeight: 'bold', paddingBottom: '.13rem' },
      oldPriceDecoration: {
        textDecoration: 'line-through',
      },
      newPrice: {
        lineHeight: '1em',
        '&>span': {
          lineHeight: '1em',
        },
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
