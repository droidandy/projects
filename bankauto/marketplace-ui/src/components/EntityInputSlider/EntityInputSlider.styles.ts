import { makeStyles } from '@material-ui/core';

const useSliderStyles = makeStyles(({ palette: { background } }) => ({
  rail: {
    backgroundColor: background.paper,
  },
  thumb: {
    height: '0.875rem',
    width: '0.875rem',
    marginTop: '-0.5625rem',
  },
}));

const useInputStyles = makeStyles(({ breakpoints: { down } }) => ({
  input: {
    webkitAappearance: 'none',
    mozAappearance: 'none',
    appearance: 'none',
    padding: '1rem 1.25rem 1.25rem',
    fontWeight: 700,
    fontSize: '1.25rem',
    border: '1px solid #E8E8E8',
    borderBottom: 'none',
    borderRadius: '0.5rem 0.5rem 0.125rem 0.125rem',
    [down('xs')]: {
      fontSize: '1rem',
      padding: '0.75rem 1.125rem',
    },
  },
}));

export { useSliderStyles, useInputStyles };
