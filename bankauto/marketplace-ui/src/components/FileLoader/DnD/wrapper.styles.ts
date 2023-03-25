import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  () => ({
    root: {
      transition: 'border .24s ease-in-out',
      cursor: 'move',
    },
    isDrugging: {
      opacity: '0.1',
    },
  }),
  { name: 'DraggableItem' },
);

export { useStyles };
