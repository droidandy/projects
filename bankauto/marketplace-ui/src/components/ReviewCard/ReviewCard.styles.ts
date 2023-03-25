import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette: { primary, secondary }, typography, breakpoints: { down } }) => ({
    rootContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderTop: `1px solid ${secondary.light}`,
      padding: '1.25rem 0 1.875rem 0',
      '&:last-child': {
        borderBottom: `1px solid ${secondary.light}`,
      },
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      paddingBottom: '1.875rem',
    },
    contentContainer: {
      width: '100%',
      paddingLeft: '3.75rem',
      [down('xs')]: {
        paddingLeft: 0,
      },
    },

    userInfo: {
      display: 'flex',
      alignItems: 'center',
    },
    avatar: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1.5rem',
      fontWeight: typography.fontWeightBold,
      color: primary.contrastText,
      backgroundColor: primary.main,
      borderRadius: '50%',
      width: '2.5rem',
      height: '2.5rem',
      marginRight: '1.25rem',
      '& span': {
        marginLeft: '-2px',
        marginTop: '-2px',
      },
    },
    name: {
      display: 'flex',
      flexDirection: 'column',
    },

    additionalInfo: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    rating: {
      marginLeft: '1.375rem',
    },
  }),
  { name: 'ReviewCard' },
);
