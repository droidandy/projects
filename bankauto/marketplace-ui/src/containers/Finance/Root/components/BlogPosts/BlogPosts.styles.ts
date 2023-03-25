import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { primary, text }, breakpoints: { down } }) => ({
    blogPostsContainer: {
      padding: '2.5rem 0 ',
      [down('xs')]: {
        padding: ' 1.25rem 0  1.25rem 0.625rem',
      },
    },
    header: {
      fontWeight: 'bold',
      marginBottom: '1.25rem',
      color: text.primary,
      [down('xs')]: {
        marginBottom: '0.75rem',
      },
    },
    category: {
      flexShrink: 0,
      [down('xs')]: {
        fontSize: '1rem',
        marginBottom: '0.75rem',
      },
    },
    active: {
      fontWeight: 'bold',
      color: primary.main,
      pointerEvents: 'none',
      '&:after': {
        position: 'absolute',
        display: 'block',
        left: '0.5rem',
        bottom: '-0.4rem',
        right: '0.5rem',
        content: '""',
        height: '0.1875rem',
        backgroundColor: primary.main,
      },
    },
    categoryContainer: {
      display: 'flex',
      gap: '2rem',
      overflowX: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '2.5rem',
      [down('xs')]: {
        justifyContent: 'start',
        paddingBottom: '1.25rem',
      },
    },

    gridItem0: {
      gridArea: 'gridItem0',
    },
    gridItem1: {
      gridArea: 'gridItem1',
    },
    gridItem2: {
      gridArea: 'gridItem2',
    },
    gridItem3: {
      gridArea: 'gridItem3',
    },
    gridItem4: {
      gridArea: 'gridItem4',
    },

    gridContainer: {
      display: 'grid',
      gap: '40px',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gridTemplateAreas: `
         "gridItem0 gridItem0 gridItem1 gridItem2"
         "gridItem0 gridItem0 gridItem3 gridItem4"
         `,
    },
  }),
  { name: 'BlogPosts' },
);

export { useStyles };
