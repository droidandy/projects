import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette }) => ({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 1.6875rem 1rem 1rem',
      backgroundColor: palette.secondary.light,
      borderRadius: '.5rem',
      cursor: 'pointer',
    },
    icon: {
      fill: 'none',
      width: 'initial',
      height: 'initial',
    },
    contentContainer: {
      padding: '1.25rem',
    },
  }),
  { name: 'OptionsDrawer' },
);

export const useGroupOptionClasses = makeStyles(() => ({
  root: {
    padding: '0 0 1.25rem',
  },
  container: {
    padding: '1.25rem 0 0',
  },
}));
