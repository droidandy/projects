import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({
    palette: {
      primary: { contrastText },
    },
    breakpoints: { down },
  }) => ({
    colorTitle: {
      '& h1': {
        color: `${contrastText} !important`,
        [down('xs')]: {
          fontSize: '2rem',
          lineHeight: '3rem',
          fontWeight: 'bold',
        },
      },
    },
  }),
);
