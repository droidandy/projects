import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, palette: { background } }) => {
    return {
      root: {
        position: 'relative',
        top: '-3.5rem',
        maxWidth: '65rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '3.75rem 8.438rem',
        backgroundColor: background.paper,
        borderRadius: 8,
        boxShadow: '0px 8px 48px rgba(0, 0, 0, 0.1)',
      },
      header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '0.5rem',
      },
      headerContent: {
        display: 'flex',
        flexDirection: 'row',
      },
      userReview: {
        marginBottom: '2.25rem',
      },
      rating: {
        marginLeft: '4.6rem',
      },
      address: {
        marginBottom: '2.5rem',
      },
      list: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxWidth: '21rem',
      },
      listItem: {
        display: 'flex',
        alignItems: 'center',
      },
      amenity: {
        width: '50%',
        marginBottom: '0.875rem',
      },
      iconContainer: {
        lineHeight: 0,
        marginRight: '0.75rem',
      },
      icon: {
        fill: 'none',
        width: '1.2rem',
        height: '1.2rem',
      },
      section: {
        marginBottom: '2.5rem',
      },
      title: {
        marginBottom: '1.25rem',
      },
      tag: {
        display: 'inline-block',
        marginLeft: '0.5rem',
      },
      box: {
        display: 'flex',
        height: '8.25rem',
      },
      slideImage: {
        display: 'flex',
      },
      workHours: {
        fontWeight: 700,
      },
      workType: {
        display: 'inline-flex',
        alignItems: 'center',
      },
      workTypeName: {
        width: 'max-content',
      },
      separator: {
        display: 'inline-block',
        width: 4,
        height: 4,
        borderRadius: 2,
        margin: '0 8px',
        backgroundColor: '#000',
      },
    };
  },
  { name: 'AutoRepairShopInfo' },
);

export { useStyles };
