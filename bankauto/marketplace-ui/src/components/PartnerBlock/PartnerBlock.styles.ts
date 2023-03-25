import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      text: { hint },
    },
  }) => {
    return {
      dealer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      dealerLogoWrapper: {
        position: 'relative',
        width: '50%',
        height: '2rem',
        marginBottom: '1rem',
      },
      dealerAddress: {
        color: hint,
      },
    };
  },
  { name: 'PartnerBlock' },
);

export { useStyles };
