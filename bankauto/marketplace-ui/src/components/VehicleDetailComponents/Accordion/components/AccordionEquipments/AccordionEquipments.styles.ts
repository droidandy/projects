import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  () => ({
    listContainer: {
      marginLeft: '1.25rem',
      listStyleType: 'disc',
    },
    listItem: {
      paddingBottom: '1.25rem',
    },
  }),
  { name: 'AccordionTab' },
);
