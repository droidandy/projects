import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ breakpoints: { down }, palette }) => ({
  table: {
    marginTop: '1.875rem',
    border: `1px solid ${palette.secondary.light}`,
    borderRadius: '0.5rem',
    [down('xs')]: {
      marginTop: '1.25rem',
    },
  },
  row: {
    borderBottom: `1px solid ${palette.secondary.light}`,
    '&:last-of-type': {
      borderBottom: 'none',
    },
  },
  cell: {
    padding: '1rem 2.5rem 1rem 2.5rem',
    '&:first-child': {
      borderRight: `1px solid ${palette.secondary.light}`,
    },
    [down('xs')]: {
      padding: '0.6rem 0.4rem 0.6rem 0.6rem',
    },
  },
  secondCell: {
    paddingTop: '0.75rem',
    paddingBottom: '0.875rem',
  },
  title: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    [down('xs')]: {
      fontSize: '0.75rem',
      lineHeight: '1.25rem',
    },
  },
  subtitle: {
    fontSize: '1.25rem',
    lineHeight: '1.875rem',
    [down('xs')]: {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
    },
  },
  desc: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    fontWeight: 600,
    [down('xs')]: {
      fontSize: '0.75rem',
      lineHeight: '1.25rem',
    },
  },
}));

export { useStyles };
