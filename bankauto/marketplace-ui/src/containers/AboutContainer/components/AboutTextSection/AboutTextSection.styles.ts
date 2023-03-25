import { makeStyles } from '@material-ui/core/styles';
import { $fontH4, $fontMobileH3, $fontRegular, $fontMobileRegular } from '@marketplace/ui-kit';

const useStyles = makeStyles(
  ({
    palette: {
      primary: { main, contrastText },
    },
    breakpoints: { down },
  }) => ({
    root: {
      padding: '5rem 0 0 0',
      [down('xs')]: {
        padding: 0,
      },
    },
    gridContent: {
      position: 'relative',
      top: '-3rem',
      marginBottom: '-3rem',
      [down('xs')]: {
        position: 'unset',
        top: 'unset',
        marginBottom: 'unset',
      },
    },
    accentBlock: {
      fontWeight: 700,
      ...$fontH4,
      color: contrastText,
      backgroundColor: main,
      padding: '2.5rem',
      borderRadius: '.5rem',
      position: 'relative',
      top: '-3.875rem',
      '& > h4:first-of-type': {
        marginBottom: '1.875rem',
      },
      [down('xs')]: {
        top: '-1.875rem',
        padding: '1.25rem',
      },
      '& h4': {
        fontWeight: 700,
        ...$fontMobileH3,
      },
    },
    textBlock: {
      top: '-.625rem',
      position: 'relative',
      fontWeight: 400,
      ...$fontRegular,
      '& > p:first-of-type': {
        marginBottom: '1.875rem',
      },
      [down('xs')]: {
        ...$fontMobileRegular,
        padding: '0 .625rem',
      },
    },
  }),
);

export { useStyles };
