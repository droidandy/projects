import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette: { primary }, breakpoints: { down } }) => ({
    button: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: primary.contrastText,
      borderRadius: '.5rem',
      backgroundColor: primary.main,
      transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      padding: '1rem 1.375rem 1.25rem',
      '&:hover': {
        backgroundColor: primary.dark,
      },
      [down('xs')]: {
        width: '100%',
      },
    },
  }),
  { name: 'Link' },
);
