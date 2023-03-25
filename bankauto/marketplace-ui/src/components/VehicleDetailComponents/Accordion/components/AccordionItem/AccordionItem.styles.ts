import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    childrenWrapper: {
      [down('xs')]: {
        marginLeft: '-0.75rem',
      },
    },
    additionText: {
      fontWeight: 600,
    },
  }),
  { name: 'AccordionItem' },
);
