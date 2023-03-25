import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(
  ({ palette: { grey, background }, breakpoints: { down } }) => ({
    vehiclesListContainer: {
      [down('xs')]: {
        backgroundColor: grey[200],
      },
    },
    listItem: {
      [down('xs')]: {
        backgroundColor: background.paper,
        marginTop: '0.625rem',
      },
    },
    itemDivider: {
      height: '0.625rem',
      backgroundColor: grey[200],
      margin: '0 -1.25rem',
    },
  }),
  { name: 'VehiclesList' },
);
