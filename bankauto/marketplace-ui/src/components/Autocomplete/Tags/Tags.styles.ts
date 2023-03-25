import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down } }) => ({
  root: {
    position: 'absolute',
    top: '3rem',
    left: '1.875rem',
    right: '3.75rem',
    display: 'flex',
    flexWrap: 'nowrap',
    [down('xs')]: {
      left: '1.25rem',
      top: '1.625rem',
      right: '4.5rem',
    },
  },
  rootHook: {
    display: 'flex',
    flexWrap: 'nowrap',
    paddingTop: '1rem',
  },
  labelText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  suffixBadge: {
    paddingLeft: '0.5rem',
  },
}));

export { useStyles };
