import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { primary } }) => ({
    option: {
      padding: '1.125rem 0',
      fontSize: '1rem',
      '&:hover': {
        color: primary.main,
      },
    },
    optionLabel: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: 'flex',
      flexDirection: 'column',
    },
    optionSelected: {
      color: primary.main,
      fontWeight: 600,
    },
    iconSelected: {
      fontSize: '1.25rem',
      lineHeight: '1em',
      width: '1.25rem',
      height: '1.25rem',
    },
  }),
  { name: 'UI-KIT-Option' },
);

export { useStyles };
