import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    root: {
      width: '100%',
      overflowX: 'scroll',
      whiteSpace: 'nowrap',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      '&::scrollbar': {
        display: 'none',
      },
      [down('xs')]: {
        '& > .MuiGrid-item': {
          minWidth: '96%',
        },
      },
    },
    imageWrapper: {
      borderRadius: '.5rem',
      maxWidth: '21.25rem',
      position: 'relative',
      width: '14.5rem',
      height: '9.75rem',
      overflow: 'hidden',
      marginRight: '.375rem',
      display: 'inline-block',
      '&:last-child': {
        marginRight: 0,
      },
    },
  }),
  {
    name: 'ReviewCardPhotos',
  },
);
