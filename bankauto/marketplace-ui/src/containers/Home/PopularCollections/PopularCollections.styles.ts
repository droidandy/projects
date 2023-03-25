import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    breakpoints: { down },
    palette: {
      secondary: { light },
    },
  }) => ({
    root: {
      width: '100%',
      height: '15.25rem',
      borderRadius: '0.5rem',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: light,
      [down('xs')]: {
        height: 'calc(100vw/1.8)',
      },
    },
    title: {
      zIndex: 1,
      padding: '1.25rem',
      paddingRight: 0,
    },
    wrapper: {
      overflowX: 'scroll',
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
    mainTitle: {
      paddingBottom: '2.5rem',
      [down('xs')]: {
        paddingBottom: '1.25rem',
      },
    },
  }),
  { name: 'PopularCollections' },
);

export { useStyles };
