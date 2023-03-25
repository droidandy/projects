import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  {
    root: {
      maxWidth: '32.5rem',
    },
    icon: {
      fill: 'none',
      margin: '0 auto',
      height: '3.5rem',
      width: '3.5rem',
    },
    car: {
      '& img': {
        height: '10rem',
      },
      ['@media (max-width:425px)']: {
        transform: 'translate(-3rem)',
      },
      ['@media (max-width:1200px)']: {
        transform: 'translate(3rem)',
      },
      transform: 'translate(4rem)',
    },
  },
  { name: 'SubscriptionWizardModal' },
);
