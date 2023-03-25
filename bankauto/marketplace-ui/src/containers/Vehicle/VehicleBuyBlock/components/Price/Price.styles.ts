import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  crossedPrice: {
    fontWeight: 'bold',
    textDecoration: 'line-through',
  },
  price: {
    fontWeight: 'bold',
  },
}));

export { useStyles };
