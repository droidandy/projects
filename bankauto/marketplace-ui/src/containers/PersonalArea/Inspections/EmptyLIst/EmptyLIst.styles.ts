import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette: { secondary }, breakpoints: { down } }) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '0.5rem',
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: secondary.light,
      [down('xs')]: {
        marginTop: '0',
      },
    },
  }),
  { name: 'InspectionsEmptyList' },
);
