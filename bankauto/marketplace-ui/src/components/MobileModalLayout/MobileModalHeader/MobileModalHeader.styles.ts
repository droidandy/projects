import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { grey } }) => ({
    root: {
      borderBottom: `1px solid ${grey[200]}`,
    },
    container: {
      padding: '0 1.25rem',
    },
    bar: {
      minHeight: '2.65rem',
      height: '2.65rem',
    },
    title: { padding: '.5rem 0' },
    iconComponent: { padding: '.5rem 0' },
    iconButton: {
      padding: '.5rem',
    },
    iconButtonLeft: {
      marginRight: 0,
      marginLeft: '-.5rem',
    },
    icon: {
      fill: 'none',
      width: 'initial',
      height: 'initial',
    },
    rightSlot: {
      textAlign: 'right',
    },
    actionButtonLabel: {
      fontWeight: 700,
    },
  }),
  { name: 'MobileModalHeader' },
);

export { useStyles };
