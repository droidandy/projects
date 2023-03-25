import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles<Theme>(
  ({ breakpoints: { down } }) => ({
    root: {
      padding: 0,
      '& button': {
        padding: 0,
        paddingBottom: '0.625rem',
        [down('xs')]: {
          opacity: 1,
        },
      },
      [down('xs')]: {
        '& button:not(:last-of-type)': {
          marginRight: '1rem',
        },
        '& button > span': {
          opacity: '1 !important',
        },
      },
      '& span': {
        height: '3px',
        zIndex: 1,
      },
    },
    divider: {
      position: 'relative',
      top: '-1px',
    },
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
  { name: 'Brands' },
);
