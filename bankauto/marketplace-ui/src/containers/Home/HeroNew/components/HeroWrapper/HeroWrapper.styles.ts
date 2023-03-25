import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({
    breakpoints: { down, up },
    palette: {
      grey,
      primary: { main },
      common: { white },
    },
  }) => ({
    banner: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      position: 'relative',
      height: '35rem',
      '& .MuiTabs-root': {
        paddingTop: 0,
      },
      [down('xs')]: {
        height: '23.5625rem',
      },
    },
    links: {
      width: 'auto',
      position: 'relative',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      [up('sm')]: {
        display: 'flex',
        justifyContent: 'center',
      },
    },
    link: {
      position: 'relative',
      display: 'inline-block',
      fontSize: '1rem',
      lineHeight: '1.5',
      padding: '0 0.3125rem 0.25rem 0.3125rem',
      margin: '0 0.3125rem',
      color: white,
      opacity: 0.8,
      '&.active': {
        opacity: 1,
        borderBottom: `0.25rem ${main} solid`,
        fontWeight: 'bold',
        cursor: 'default',
      },
      [up('sm')]: {
        fontSize: '1.25rem',
        padding: '0 1.25rem 0.5rem 1.25rem',
        margin: '0 1.875rem',
      },
    },
    titleWrapper: {
      marginTop: '6.25rem',
      marginBottom: '3rem',
      height: '17.75rem',
      zIndex: 1,
      [down('xs')]: {
        height: '9.625rem',
        marginTop: '6.25rem',
        marginBottom: '1.875rem',
      },
    },
    filterContainer: {
      backgroundColor: grey[100],
      [down('xs')]: {
        backgroundColor: grey[200],
      },
    },
    filterWrapper: {
      position: 'relative',
      bottom: '50%',
      [down('xs')]: {
        bottom: '1.875rem',
      },
    },
  }),
  { name: 'MKP-Landing-Hero' },
);
