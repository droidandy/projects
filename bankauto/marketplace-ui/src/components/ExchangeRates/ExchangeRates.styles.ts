import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    root: {
      width: '100%',
      display: 'flex',
      '&>*': {
        marginRight: '2.5rem',
        alignSelf: 'stretch',
        width: '22.8125rem',
        [down('xs')]: {
          width: '100%',
          marginRight: 0,
          marginBottom: '1.25rem',
          alignSelf: 'center',
        },
        '&:last-child': {
          marginRight: 0,
          marginBottom: 0,
          alignSelf: 'center',
        },
      },
      [down('xs')]: {
        flexDirection: 'column',
      },
    },

    header: {
      display: 'flex',
      alignItems: 'baseline',
      alignSelf: 'center',
      justifySelf: 'center',
      width: 'auto',
      margin: 'auto',
      [down('xs')]: {
        flexDirection: 'column',
        alignItems: 'center',
      },
    },

    headerTitle: {
      '&::after': {
        content: '" "',
        whiteSpace: 'pre',
        [down('xs')]: {
          display: 'none',
        },
      },
    },

    item: {
      marginRight: '2.5rem',
      alignSelf: 'stretch',
      [down('xs')]: {
        marginRight: 0,
        marginBottom: '0.625rem',
        alignSelf: 'center',
      },
      '&:last-child': {
        marginRight: 0,
        marginBottom: 0,
      },
    },
  }),
  {
    name: 'ExchangeRates',
  },
);

export { useStyles };
