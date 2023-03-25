import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      grey: { 500: grey500, 800: grey800 },
      common: { white },
    },
  }) => ({
    submitButton: {
      background: grey500,
      color: white,
      fontWeight: 'bold',
      fontSize: '1rem',
      '&:hover': {
        background: grey800,
      },
    },
  }),
  { name: 'MKP-profile-main-info-form' },
);

export { useStyles };
