import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    listContainer: {},
    listItem: {
      paddingBottom: '1.25rem',
      paddingRight: '9.375rem',
      [down('xs')]: {
        paddingRight: 0,
      },
    },
    meaning: {
      fontWeight: 600,
    },
  }),
  { name: 'AccordionTab' },
);
