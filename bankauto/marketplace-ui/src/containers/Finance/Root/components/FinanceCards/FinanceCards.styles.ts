import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    breakpoints: { down },
    palette: {
      secondary: { light },
    },
  }) => ({
    cards: {
      position: 'relative',
      top: '-3.75rem',
      marginBottom: '2.5rem',
      [down('xs')]: {
        top: '-2.5rem',
        marginBottom: 0,
      },
      '& a': {
        padding: '1rem',
      },
      '&:before': {
        content: '""',
        position: 'absolute',
        width: '100%',
        top: '3.3125rem',
        bottom: '-3.3125rem',
        backgroundColor: light,
        [down('xs')]: {
          top: '2.5rem',
          bottom: '-1.25rem',
        },
      },
      '& > div': {
        position: 'relative',
        zIndex: 2,
      },
    },
  }),
);

export { useStyles };
