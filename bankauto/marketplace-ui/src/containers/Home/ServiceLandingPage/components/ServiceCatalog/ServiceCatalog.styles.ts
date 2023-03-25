import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { text }, breakpoints: { down } }) => ({
    container: {
      padding: '2.5rem 0 ',
      [down('xs')]: {
        padding: ' 1.25rem 0  1.25rem 0.625rem',
      },
    },
    header: {
      fontWeight: 'bold',
      marginBottom: '3.75rem',
      color: text.primary,
      [down('xs')]: {
        marginBottom: '1.5rem',
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
  { name: 'ServiceCatalog' },
);

export { useStyles };
