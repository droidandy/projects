import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { primary } }) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexWrap: 'nowrap',
    overflow: 'scroll',
    '-ms-overflow-style': 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  tab: {
    borderRadius: '0.5rem',
    marginRight: '2.5rem',
    '&:last-of-type': {
      marginRight: '0',
    },
  },
  active: {
    color: primary.main,
    borderBottom: `3px solid ${primary.main}`,
    borderRadius: 0,
    paddingBottom: '0.6875rem',
    '& > p': {
      fontWeight: 'bold',
    },
  },
}));

export { useStyles };
