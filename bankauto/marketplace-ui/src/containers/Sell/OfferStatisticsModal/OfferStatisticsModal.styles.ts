import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  {
    root: {
      maxWidth: '32.5rem',
    },
    statisticsItem: {
      display: 'flex',
      alignItems: 'stretch',
      flexFlow: 'row nowrap',
      '&:not(:first-of-type)': {
        paddingTop: '1.25rem',
      },
    },
    iconWrapper: {
      display: 'flex',
      alignItems: 'center',
      marginRight: '1.25rem',
    },
    statisticsButton: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    butonText: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: '1.25rem',
    },
    icon: {
      width: '2rem',
      height: '2rem',
    },
  },
  { name: 'OfferStatisticModal' },
);
