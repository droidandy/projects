import { makeStyles } from '@material-ui/core/styles';

import { $fontMobileH5 } from '@marketplace/ui-kit';

const useStyles = makeStyles(
  ({ palette }) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2.563rem 0.875rem 1.125rem',
    },
    gray: {
      background: palette.grey['200'],
      borderRadius: '0.5rem',
    },
    iconContainer: {
      width: '3rem',
      height: '3rem',
    },
    icon: {
      fill: 'none',
      fontSize: '3rem',
    },
    title: {
      textAlign: 'center',
      marginTop: '0.938rem',
      width: '15.75rem',
      minHeight: '5.625rem',
      whiteSpace: 'break-spaces',
      fontWeight: 700,
      ...$fontMobileH5,
    },
  }),
  {
    name: 'StaticCustomerFlowItem',
  },
);

export { useStyles };
