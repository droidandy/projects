import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { text }, breakpoints: { down } }) => ({
  hero: {
    [down('xs')]: {
      height: '23.4375rem',
    },
    '& > span': {
      display: 'none',
    },
    '& h1, & h4': {
      color: text.primary,
      [down('xs')]: {
        padding: '0 3rem',
      },
    },
  },
  heroContent: {
    [down('xs')]: {
      top: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.875rem 0 1rem',
    },
  },
  tabsWrapperRoot: {
    [down('xs')]: {
      padding: '0 1.25rem',
    },
    '& .MuiTab-root': {
      padding: '0 0 0.5rem',
      marginRight: '2.5rem',
    },
    '& .Mui-selected': {
      '&:last-child': {
        marginRight: 0,
      },
    },
    '& .MuiTabs-indicator': {
      height: '0.1875rem',
    },
  },
}));

export { useStyles };
