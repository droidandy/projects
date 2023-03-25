import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      primary,
      common: { white },
    },
  }) => ({
    tooltip: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontWeight: 600,
      padding: '1.25rem',
      backgroundColor: primary.main,
      maxWidth: '28.5rem',
      color: primary.contrastText,
      borderRadius: 8,
      position: 'relative',
      overflow: 'visible',
      border: `1px solid ${white}`,
    },
    smallTooltip: {
      maxWidth: '95%',
    },
  }),
);

export { useStyles };
