import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  title: {
    fontSize: '1.25rem',
    lineHeight: 1.5,
    marginBottom: '2.375rem',
    paddingLeft: '1.875rem',
  },
  inputs: {
    borderRadius: '0.5rem',
    boxShadow: '0 .5rem 3rem rgba(0, 0, 0, .1)',
    overflow: 'hidden',
  },
}));

export { useStyles };
