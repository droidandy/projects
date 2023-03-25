import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  icon: {
    fontSize: '2.5rem',
    fill: 'none',
    marginRight: '1.5rem',
  },
  text: {
    paddingTop: '0.35rem',
  },
}));
