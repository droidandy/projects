import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles<Theme>(
  ({
    breakpoints: { down },
    palette: {
      secondary: { light },
      common: { black },
    },
  }) => ({
    wrapper: {
      paddingRight: 0,
      paddingLeft: 0,
      position: 'static',
      [down('xs')]: {
        marginTop: 0,
        top: 0,
      },
    },
    cards: {
      display: 'flex',
      [down('xs')]: {
        padding: '1.25rem 0 1.75rem',
      },
    },
    card: {
      marginRight: '2.5rem',
      boxShadow: 'none',
      '& p': {
        color: black,
        '&:last-child': {
          fontSize: '1rem',
          [down('xs')]: {
            fontSize: '0.875rem',
          },
        },
      },
      '&:last-child': {
        marginRight: 0,
      },
      [down('xs')]: {
        alignSelf: 'stretch',
        width: '100%',
        height: '100%',
        padding: '1.25rem',
        boxSizing: 'border-box',
        flexShrink: 0,
        backgroundColor: light,
        '& .material-icons': {
          marginBottom: '1.25rem',
          backgroundColor: 'transparent',
        },
      },
    },
  }),
  { name: 'SafeDealFinanceCards' },
);

export { useStyles };
