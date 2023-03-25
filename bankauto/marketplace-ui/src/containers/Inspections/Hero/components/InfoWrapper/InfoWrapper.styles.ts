import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette: { common } }) => {
    return {
      root: {
        padding: '1.25rem',
        backgroundColor: common.white,
        borderRadius: '0.5rem',
        boxShadow: '0px 0.5rem 3rem rgba(0, 0, 0, 0.1)',
      },
    };
  },
  { name: 'InspectionsHero' },
);
