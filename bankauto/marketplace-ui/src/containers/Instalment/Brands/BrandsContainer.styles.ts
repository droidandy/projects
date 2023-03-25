import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles<Theme>(
  ({ breakpoints: { down } }) => ({
    blocksItem: {
      padding: '0 3.75rem',
      '&:first-of-type': {
        paddingLeft: '2.5rem',
      },
      '&:last-of-type': {
        paddingRight: '2.5rem',
      },
      [down('xs')]: {
        padding: '0 !important',
      },
    },
  }),
  { name: 'Brands-Instalment' },
);
