import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { grey }, breakpoints: { up } }) => ({
    flex: {
      display: 'flex',
    },
    block: {
      marginBottom: '1.25rem',
    },
    subBlock: {
      marginBottom: '0.625rem',
    },
    nextBlock: {
      marginLeft: '0.625rem',
    },
    boldText: {
      fontWeight: 'bold',
    },
    listItemWrapper: {
      marginBottom: '1.875rem',
    },
    wrapper: {
      border: `1px solid ${grey[200]}`,
      borderRadius: '1rem',
      '&:not(:first-child)': {
        marginTop: '1.875rem',
      },
    },
    policy: {
      display: 'flex',
      flexWrap: 'nowrap',
      alignItems: 'stretch',
    },
    leftBlock: {
      padding: '1.875rem 0 1.875rem 1.875rem',
    },
    iconWrapper: {
      width: '23.125rem',
      minWidth: '23.125rem',
      minHeight: '15.375rem',
      borderRadius: '0.5rem',
      position: 'relative',
      overflow: 'hidden',
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
        width: '6rem',
        height: '6rem',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
      [up('sm')]: {
        '& > div': {
          height: '100%',
        },
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
    rightBlock: {
      width: '22.9rem',
      minWidth: '22.9rem',
      borderLeft: `1px solid ${grey[200]}`,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '1.875rem 1.875rem 1.875rem 2.5rem',
      marginLeft: '2.5rem',
    },
    mainInfo: {
      marginLeft: '2.375rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexGrow: 1,
      padding: '1.875rem 0',
    },
    chipsWrapper: {
      marginLeft: '0.625rem',
      display: 'flex',
      justifyContent: 'center',
    },
    buttonWrapper: {
      width: '22.75rem',
      minWidth: '22.75rem',
      maxWidth: '100%',
    },
  }),
  { name: 'PolicyItem' },
);

export { useStyles };
