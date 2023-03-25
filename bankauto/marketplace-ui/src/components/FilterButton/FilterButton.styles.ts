import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  buttonIcon: {
    fontSize: '2rem',
    fill: 'none',
  },
  showVehiclesButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '0 0.5rem 0.5rem 0',
    [down('xs')]: {
      borderRadius: '0 0 0.5rem 0.5rem',
    },
  },
}));

export { useStyles };
