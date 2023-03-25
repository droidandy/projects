import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { text } }) => ({
    root: {
      color: text.secondary,
      display: 'flex',
      alignItems: 'center',
      lineHeight: '1rem',
    },
    separator: {
      display: 'inline-block',
      marginLeft: '1.875rem',
    },
    viewsIcon: {
      marginRight: '0.71875rem',
      stroke: 'currentColor',
      width: '1.3125rem',
      height: '0.845rem',
    },
  }),
  { name: 'CarInfoAdditional' },
);

export { useStyles };
