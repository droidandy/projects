import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    breakpoints: { down },
    palette: {
      secondary: { light },
      common: { black },
    },
  }) => ({
    wrapper: {
      paddingRight: 0,
      position: 'relative',
      marginTop: '-10.1875rem',
      top: '-5.9375rem',
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
      '&:last-child': {
        marginRight: 0,
      },
      '& p': {
        whiteSpace: 'pre-wrap',
      },
      [down('xs')]: {
        alignSelf: 'stretch',
        width: '100%',
        height: '100%',
        padding: '1.25rem',
        boxSizing: 'border-box',
        flexShrink: 0,
        backgroundColor: light,
        boxShadow: 'none',
        '& .material-icons': {
          marginBottom: '1.25rem',
          backgroundColor: 'transparent',
        },
        '& p': {
          color: black,
          whiteSpace: 'pre-wrap',
        },
      },
    },
  }),
);

export { useStyles };
