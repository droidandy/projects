import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  () => ({
    buyButton: {
      marginTop: '1rem',
      display: 'block',
      padding: '0.5rem',
      minHeight: '3.75rem',
    },
    learnMoreButton: {
      display: 'block',
      padding: '0.5rem',
    },
  }),
  { name: 'SubscriptionBlock' },
);

export { useStyles };
