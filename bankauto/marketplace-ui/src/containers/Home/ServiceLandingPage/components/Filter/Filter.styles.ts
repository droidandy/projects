import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles<Theme>(
  ({ breakpoints: { down }, palette: { grey } }) => ({
    control: {
      border: `0.063rem solid ${grey[200]}`,
      borderRadius: '0.5rem',
      height: '5rem',
      [down('xs')]: {
        height: '3.75rem',
      },
    },
    items: {
      marginTop: '1.25rem',
      marginBottom: '1.25rem',
    },
    icon: {
      maxWidth: '1.875rem',
      maxHeight: '1.875rem',
      width: 'auto',
      height: 'auto',
      display: 'block',
      margin: '0 auto',
    },
  }),
  { name: 'Filter' },
);
