import { makeStyles } from '@material-ui/core';

const useAllParamsButtonStyles = makeStyles(({ palette: { background } }) => ({
  root: {
    background: background.paper,
    borderRadius: '0.5rem',
    height: '3.75rem',
  },
  endIcon: {
    '& > *:first-child': {
      fontSize: '0.75rem',
    },
  },
}));

const useStyles = makeStyles(({ palette: { background, primary } }) => ({
  allParamsText: {
    flex: 1,
  },
  activeFiltersBadge: {
    background: primary.main,
    borderRadius: '50%',
    width: '1.25rem',
    height: '1.25rem',
    color: background.paper,
    textAlign: 'center',
    fontWeight: 600,
  },
}));

export { useStyles, useAllParamsButtonStyles };
