import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette: { secondary } }) => ({
    expanded: {},
    root: {
      borderRadius: '.5rem',
      borderTop: 'none',
      '&:last-child': {
        borderBottom: 'none',
      },
      backgroundColor: secondary.light,
    },
    rounded: {
      '&:first-child': {
        borderTopLeftRadius: '.5rem',
        borderTopRightRadius: '.5rem',
      },
      '&:last-child': {
        borderBottomLeftRadius: '.5rem',
        borderBottomRightRadius: '.5rem',
      },
    },
    summaryRoot: {
      padding: '1.5rem 2.5rem',
      minHeight: '0',
      backgroundColor: 'transparent',
      '&$expanded': {
        minHeight: '0',
      },
    },
    summaryContent: {
      margin: '0',
      '&$expanded': {
        margin: '0',
      },
    },
    detailsRoot: {
      display: 'block',
      padding: '0 2.5rem',
      backgroundColor: 'transparent',
      borderTop: '1px solid white',
    },
  }),
  { name: 'OptionsCollapse' },
);
