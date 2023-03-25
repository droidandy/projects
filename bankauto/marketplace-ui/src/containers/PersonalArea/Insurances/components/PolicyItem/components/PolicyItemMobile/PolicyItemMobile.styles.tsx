import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  () => ({
    root: {
      padding: '1.25rem',
    },
    iconWrapper: {
      width: '4.625rem',
      minHeight: 'auto',
      minWidth: 'auto',
      height: '3rem',
      borderRadius: '0.5rem',
      position: 'relative',
      overflow: 'hidden',
      '& img': {
        objectFit: 'cover',
      },
      '&::before': {
        position: 'absolute',
        content: '""',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.08)',
      },
      '&::after': {
        position: 'absolute',
        content: '""',
        backgroundColor: '#fff',
        borderRadius: '0.25rem',
        width: '1.875rem',
        height: '1.875rem',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    },
    icon: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      zIndex: 1,
    },
    subtitle: {
      textTransform: 'uppercase',
    },
    policyNameWrapper: {
      display: 'flex',
      flexWrap: 'nowrap',
      alignItems: 'center',
    },
    policyName: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginLeft: '1.125rem',
    },
    subBlock: {
      marginBottom: '0.625rem',
    },
    dividerWrapper: {
      margin: '1.25rem 0',
    },
    smallMargin: {
      marginBottom: '0.625rem',
    },
    listItemWrapper: {
      marginBottom: '1.25rem',
    },
  }),
  { name: 'PolicyItem' },
);

export { useStyles };
