import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ mixins, breakpoints: { down } }) => {
    return {
      root: {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 0 auto',
        flexGrow: 1,
        overflow: 'auto',
        flexBasis: `calc(100vh - ${mixins.toolbarHeight})`,
        [down('xs')]: {
          flex: '1 0 auto', // Fix IOS 13 bug
        },
      },
      drawerPaper: {
        left: '0',
        overflow: 'hidden',
        [down('xs')]: {
          overflow: 'scroll', // Fix IOS 13 bug
        },
      },
      disableScroll: {
        margin: '0',
        height: '100%',
        overflow: 'hidden',
        '& body': {
          margin: '0',
          height: '100%',
          overflow: 'hidden',
        },
      },
    };
  },
  {
    name: 'HeaderDrawer',
  },
);

export { useStyles };
