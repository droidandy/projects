import { makeStyles } from '@material-ui/core/styles';
import { $fontH5, $fontMobileH5, $fontMobileRegular, $fontRegular } from '@marketplace/ui-kit';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  root: {
    padding: '5rem 0',
    [down('xs')]: {
      padding: '1.875rem 0',
    },
  },
  contactsTitle: {
    marginBottom: '5rem',
    [down('xs')]: {
      fontWeight: 700,
      ...$fontMobileH5,
      marginBottom: '1.875rem',
    },
  },
  icon: {
    fill: 'none',
    fontSize: '3.75rem',
  },
  contactsItem: {
    padding: '4.0625rem',
    boxShadow: '0rem 0.5rem 3rem 0rem rgba(0, 0, 0, 0.1)',
    borderRadius: '.5rem',
    minHeight: '12.5rem',
    [down('xs')]: {
      padding: '1.25rem',
    },
  },
  itemTitle: {
    fontWeight: 700,
    ...$fontH5,
    [down('xs')]: {
      ...$fontMobileH5,
    },
  },
  itemDescription: {
    fontWeight: 400,
    ...$fontRegular,
    [down('xs')]: {
      whiteSpace: 'pre',
      ...$fontMobileRegular,
    },
  },
}));

export { useStyles };
