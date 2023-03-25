import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  () => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2.5rem 0',
    },
    title: {
      paddingBottom: '2rem',
    },
    action: {
      marginTop: '2rem',
      width: '30rem',
    },
    item: {},
    list: {
      '& >$item:not(:first-child)': {
        marginTop: '1.25rem',
      },
    },
    paginationWrapper: {
      width: '100%',
      paddingTop: '2.5rem',
    },
  }),
  { name: 'InspectionsList' },
);
