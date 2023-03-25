import { makeStyles } from '@material-ui/core/styles';
import { $fontMobileH5 } from '@marketplace/ui-kit';

const useStyles = makeStyles(
  ({ palette: { primary }, breakpoints: { down } }) => ({
    root: {
      padding: '5rem 0',
      [down('sm')]: {
        padding: '1.875rem 0',
      },
    },
    youtubeIcon: {
      width: '4.375rem',
      height: '3.125rem',
      marginRight: '2.5rem',
      [down('sm')]: {
        marginRight: 0,
        marginBottom: '0.5rem',
      },
    },
    howWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    buttonLabel: {
      [down('sm')]: {
        flexDirection: 'column',
      },
    },
    howToBuy: {
      color: primary.main,
      borderBottom: `0.375rem solid ${primary.main}`,

      [down('sm')]: {
        fontWeight: 700,
        ...$fontMobileH5,
        borderBottom: `0.25rem solid ${primary.main}`,
      },
    },
    iframeVideo: {
      maxWidth: '100%',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      cursor: 'pointer',
    },
  }),
  {
    name: 'StaticCustomerFlowHow',
  },
);

export { useStyles };
