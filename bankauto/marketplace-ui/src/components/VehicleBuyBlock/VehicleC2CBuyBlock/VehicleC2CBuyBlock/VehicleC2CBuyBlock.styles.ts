import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { grey }, breakpoints: { down } }) => {
    return {
      bordered: {
        border: `1px solid ${grey['200']}`,
      },
      priceBlock: {
        display: 'flex',
        padding: '1.25rem',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        border: `1px solid ${grey['200']}`,
        [down('xs')]: {
          padding: 0,
          border: 'none',
          marginBottom: '1.25rem',
        },
      },
      block: {
        paddingTop: '1.25rem',
      },
      info: {
        padding: '1.25rem 1.25rem 0 1.25rem',
        [down('xs')]: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
      bookButton: {
        display: 'block',
        position: 'relative',
        padding: '0.5rem',
        minHeight: '3.75rem',
      },
      buttonLoader: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      },
      price: {
        fontWeight: 'bold',
      },
      icon: {
        width: '2rem',
        height: '2rem',
      },
    };
  },
  { name: 'VehicleC2CBuyBlock' },
);

export { useStyles };
