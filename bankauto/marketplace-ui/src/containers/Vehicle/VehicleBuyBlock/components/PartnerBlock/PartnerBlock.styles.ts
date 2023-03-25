import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  {
    root: {
      maxWidth: '100%',
    },
    dealerLogoWrapper: {
      position: 'relative',
      width: '50%',
      height: '100%',
    },
    dealer: {
      height: '2rem',
      hyphens: 'auto',
      wordBreak: 'break-all',
    },
  },
  { name: 'PartnerBlock' },
);

export { useStyles };
