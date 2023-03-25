import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { grey }, breakpoints: { down, up } }) => {
    return {
      root: {
        border: `1px solid ${grey[200]}`,
      },
      rightBlock: {
        width: '22.75rem',
        minWidth: '22.75rem',
        borderLeft: `1px solid ${grey[200]}`,
        boxSizing: 'border-box',
      },
      vehicleImage: {
        width: '23.125rem',
        minWidth: '23.125rem',
        minHeight: '15.375rem',
        borderRadius: '0.5rem',
        position: 'relative',
        overflow: 'hidden',
        [down('xs')]: {
          width: '4.625rem',
          minHeight: 'auto',
          minWidth: 'auto',
          height: '3rem',
          '& img': {
            objectFit: 'cover',
          },
        },
        [up('sm')]: {
          '& > div': {
            height: '100%',
          },
        },
        '&::after': {
          position: 'absolute',
          content: '""',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.08)',
        },
      },
      iconPercentRed: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        zIndex: 1,
      },
    };
  },
  { name: 'ApplicationVehicleCard' },
);

export { useStyles };
