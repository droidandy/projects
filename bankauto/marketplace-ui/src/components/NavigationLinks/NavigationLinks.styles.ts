import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette: { text, primary } }) => ({
    root: {
      // container inner
      '& > div': {
        display: 'flex',
        flexWrap: 'nowrap',
        paddingTop: '0.25rem',
        paddingBottom: '0.325rem',
        alignItems: 'center',
      },
      '& $logo': {
        marginRight: '3.75rem',
        flex: '0 0 auto',
      },
      '& $navigationList': {
        marginRight: '2.5rem',
        flex: '1 0 auto',
      },
      '& $controlsList': {
        flex: '0 0 auto',
      },
    },
    logo: {
      visibility: 'hidden',
      height: '1rem',
      overflow: 'hidden',
    },
    menuItem: {
      fontWeight: 600,
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      color: text.secondary,
      '&:hover': {
        color: text.primary,
      },
    },
    menuItemActive: {
      color: primary.main,
      cursor: 'default',
      '&:hover': {
        color: primary.main,
      },
    },
    linksList: {
      display: 'flex',
      alignItems: 'center',
    },
    navigationList: {
      '& $menuItem:not(:last-child)': {
        marginRight: '2.5rem',
      },
    },
    controlsList: {},
  }),
  { name: 'MKP-Navigation' },
);
