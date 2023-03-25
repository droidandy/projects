import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, typography, palette: { grey, text } }) => {
    return {
      root: {
        maxWidth: 'none',
        [down('xs')]: {
          maxWidth: 'none',
        },
      },
      container: {
        marginTop: '1.25rem',
        marginBottom: '1.25rem',
      },
      item: {},
      fx: {
        width: '28.75rem',
        border: `0.063rem solid ${grey[200]}`,
        borderRadius: '0.5rem',
        height: '3.75rem',
        position: 'sticky',
        zIndex: 999,
        [down('xs')]: {
          width: '95%',
          margin: '0.625rem',
        },
      },
      label: {
        ...typography.h4,
        color: text.primary,
        margin: '1.25rem',
        [down('xs')]: {
          ...typography.h5,
        },
      },
    };
  },
  { name: 'AutoRepairShopList' },
);

export { useStyles };
