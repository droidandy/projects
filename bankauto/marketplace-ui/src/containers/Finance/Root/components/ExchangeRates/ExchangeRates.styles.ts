import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    breakpoints: { down },
    palette: {
      secondary: { light },
    },
  }) => ({
    exchangeRatesContainer: {
      borderBottom: `1px solid ${light}`,
      paddingBottom: '0.625rem',
      marginBottom: '2.5rem',
      marginTop: '-1.75rem',
      [down('xs')]: {
        borderBottom: `0.625rem solid ${light}`,
        paddingBottom: '2.5rem',
        marginTop: '0',
        marginBottom: '1.25rem',
      },
    },
  }),
  {
    name: 'ExchangeRates',
  },
);

export { useStyles };
