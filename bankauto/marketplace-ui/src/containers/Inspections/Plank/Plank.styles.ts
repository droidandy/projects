import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette }) => ({
    root: {
      padding: '1.5rem 1.875rem',
      display: 'flex',
      alignItems: 'center',
      border: `2px solid ${palette.primary.main}`,
      borderRadius: '0.5rem',
      cursor: 'pointer',
    },
    icon: {
      marginRight: '1.875rem',
    },
  }),
  { name: 'Plank' },
);
