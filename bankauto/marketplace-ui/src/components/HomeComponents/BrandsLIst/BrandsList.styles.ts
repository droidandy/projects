import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles<Theme>(
  ({ palette: { text }, breakpoints: { down } }) => ({
    text: {
      fontWeight: 600,
      [down('xs')]: {
        lineHeight: 2.5,
      },
    },
    vehicleCount: {
      color: text.disabled,
    },
    showAll: {
      textAlign: 'end',
      cursor: 'pointer',
    },
  }),
  { name: 'BrandsList' },
);
