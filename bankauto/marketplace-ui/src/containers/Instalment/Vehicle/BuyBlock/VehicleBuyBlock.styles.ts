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
      chip: {
        border: `1px solid ${grey[200]}`,
        borderRadius: '0.5rem',
        textAlign: 'center',
      },
      chipSelected: {
        border: 'none',
        color: 'white',
      },
      chipText: {
        cursor: 'pointer',
        textAlign: 'center',
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
