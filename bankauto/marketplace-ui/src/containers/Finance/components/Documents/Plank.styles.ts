import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette }) => ({
  plank: {
    padding: '0.625rem',
    display: 'flex',
    alignItems: 'center',
    border: `2px solid ${palette.primary.main}`,
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  icon: {
    width: '3.75rem',
    height: '3.75rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '0.625rem',
  },
}));

export { useStyles };
