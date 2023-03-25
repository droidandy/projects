import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      grey: { '200': g200 },
    },
    breakpoints: { down },
  }) => ({
    root: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      border: `0.0625rem solid ${g200}`,
      borderRadius: '1rem',
      padding: '1.875rem 2.5rem 1.875rem 1.6875rem',
      alignItems: 'stretch',
      [down('xs')]: {
        padding: '1.25rem 1.125rem',
        flexDirection: 'column',
      },
    },
    imageWrapper: {
      position: 'relative',
      width: '23.125rem',
      minHeight: '15.375rem',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      flexShrink: 0,
      marginRight: '2.325rem',
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        content: "''",
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.08)',
      },
      [down('xs')]: {
        width: '5rem',
        height: '3rem',
        minHeight: 'auto',
        marginRight: '1.25rem',
      },
    },
    defaultImage: {
      zIndex: 1,
      objectFit: 'contain',
      height: 'inherit',
    },
    leftBlock: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: '1.25rem',
      borderBottom: `0.0625rem solid ${g200}`,
    },
    dataWrapper: {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '0.875rem',
      [down('xs')]: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
      },
    },
    header: {
      paddingBottom: '1.25rem',
      [down('xs')]: {
        paddingTop: '0.625rem',
      },
    },
    titleWrapper: {
      display: 'flex',
      alignItems: 'center',
    },
    carName: {
      paddingBottom: '0.625rem',
    },
    chipsWrapper: {
      paddingLeft: '0.625rem',
      [down('xs')]: {
        paddingLeft: '0',
        paddingTop: '0.625rem',
      },
    },
    characteristics: {
      [down('xs')]: {
        paddingTop: '0.625rem',
      },
    },
    price: {
      paddingLeft: '1.25rem',
      [down('xs')]: {
        display: 'block',
        paddingLeft: 0,
      },
    },
    actionsWrapper: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      [down('xs')]: {
        flexDirection: 'column',
        justifyContent: 'center',
      },
    },
    mainButtonWrapper: {
      width: '22.75rem',
      [down('xs')]: {
        width: '100%',
      },
    },
    rightButtonsGroup: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      [down('xs')]: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        paddingTop: '0.625rem',
      },
    },
    lastButton: {
      marginLeft: '1rem',
      [down('xs')]: {
        marginLeft: 0,
      },
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
    },
    dividerWrapper: {
      paddingBottom: '1.875rem',
    },
  }),
  { name: 'InspectionsListItem' },
);

export { useStyles };
