import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      common: { white },
    },
  }) => ({
    stepNumberWrapper: {
      position: 'relative',
      width: '1.875rem',
      height: '1.875rem',
      borderRadius: '50%',
    },
    stepNumber: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      color: white,
    },
  }),
  { name: 'SellStepBlockItem' },
);

export { useStyles };
