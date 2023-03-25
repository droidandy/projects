import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette: { primary, grey, background, text }, typography, breakpoints: { down } }) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      padding: '1.875rem 2.5rem',
      background: background.paper,
      border: `1px solid ${grey[200]}`,
      boxSizing: 'border-box',
      borderRadius: '8px',
      '&:not(:last-of-type)': {
        marginBottom: '20px',
      },
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: '1.25rem',
      borderBottom: `1px solid ${grey[200]}`,
    },
    content: {
      paddingTop: '1.25rem',
    },
    contentInner: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    carServiceInfo: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      [down('xs')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    },
    clientInfo: {
      display: 'flex',
      flexDirection: 'row',
    },
    comment: {
      ...typography.body1,
      paddingTop: '2.063rem',
      color: text.primary,
      [down('xs')]: {
        paddingTop: '1.25rem',
      },
    },
    icon: {
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
      ...typography.h5,
    },
    auto: {
      ...typography.caption,
      color: grey[500],
    },
    service: {
      ...typography.subtitle1,
      color: text.primary,
      marginLeft: '0.75rem',
    },
    carService: {
      ...typography.body1,
      fontWeight: 400,
      color: text.primary,
      [down('xs')]: {
        marginBottom: '0.625rem',
      },
    },
    rating: {
      marginLeft: '1.5rem',
      [down('xs')]: {
        marginLeft: 0,
      },
    },
  }),
  { name: 'ReviewCard' },
);
