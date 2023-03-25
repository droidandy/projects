import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { grey }, breakpoints: { down } }) => {
    return {
      bordered: {
        border: `1px solid ${grey['200']}`,
      },
      bookButton: {
        display: 'block',
        padding: '0.5rem',
        minHeight: '3.75rem',
      },
      specialOfferContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      innerContent: {
        display: 'flex',
        width: '100%',
        alignItems: 'center', // remove when link will be active
      },
      contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '87.5%',
      },
      programContent: {
        display: 'flex',
        alignItems: 'center',
      },
      percent: { textAlign: 'end' },
      icon: { height: '1.65rem', width: '1.65rem' },
      iconContainer: { width: '12.5%', marginTop: '0.25rem' },
      detailedInfoLink: {
        marginTop: '0.625rem',
      },
      actionIcon: {
        '&:not(:last-of-type)': {
          paddingRight: '.625rem',
        },
      },
      specialOfferPaper: {
        [down('xs')]: {
          border: `1px solid ${grey['200']}`,
          padding: '1.25rem',
          marginTop: '1.25rem',
        },
      },
      contactContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        [down('xs')]: {
          flexDirection: 'column',
          padding: '1.25rem 0',
        },
      },
    };
  },
  { name: 'VehicleBuyBlock' },
);

export { useStyles };
