import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { grey }, breakpoints: { down, up } }) => ({
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
      [down('xs')]: {
        display: 'block',
      },
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
      [down('xs')]: {
        width: '4.625rem',
        minHeight: 'auto',
        minWidth: 'auto',
        height: '3rem',
        '& img': {
          objectFit: 'cover',
        },
        '&::after': {
          width: '1.875rem',
          height: '1.875rem',
        },
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
    },
    policyNameWrapper: {
      display: 'flex',
      flexWrap: 'nowrap',
      alignItems: 'center',
      marginBottom: '1.25rem',
    },
  }),
  { name: 'PolicyItem' },
);

export { useStyles };
