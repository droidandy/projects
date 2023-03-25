import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ breakpoints: { down } }) => {
    return {
      contentWrapper: {
        width: '48.125rem',
        margin: '0 auto',
        [down('xs')]: {
          width: '100%',
        },
        '& ol': {
          counterReset: 'li',
        },
        '& li::before': {
          counterIncrement: 'li',
          content: 'counters(li, ".") ". "',
        },
      },
      discContent: {
        listStyle: 'disc',
      },
      typographyListContent: {
        listStyle: 'lower-latin',
      },
      orderingContent: {
        marginLeft: '2.5rem',
        '&>li::before': {
          counterIncrement: 'none',
          content: '""',
        },
      },
      singleOrderContent: {
        listStyle: 'auto',
      },
      titleWrapper: {
        paddingBottom: '2.5rem',
        textAlign: 'center',
      },
      infoBlockTitle: {
        margin: '1.5rem 0',
        display: 'inline-block',
        textIndent: '1.5rem',
      },
      conditionsList: {
        '& > li': {
          position: 'relative',
        },
        '& > li::before': {
          fontWeight: 700,
          position: 'absolute',
          top: '1.5rem',
          left: 0,
        },
      },
      table: {
        width: '100%',
        textAlign: 'center',
        borderCollapse: 'collapse',
        marginTop: '1rem',
        '& td, th': {
          width: '50%',
          padding: '0.75rem',
          border: '1px solid',
        },
        '& th': {},
      },
    };
  },
  { name: 'LandingContent' },
);
