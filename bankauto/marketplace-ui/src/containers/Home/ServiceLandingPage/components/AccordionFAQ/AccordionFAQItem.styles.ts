import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    content: {
      padding: '0 0 1rem 0',
      [down('xs')]: {
        padding: '0 0 0.75rem 0',
      },
    },
  }),
  { name: 'AccordionFAQItem' },
);

export { useStyles };
