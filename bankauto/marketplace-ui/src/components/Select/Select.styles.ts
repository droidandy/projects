import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { grey } }) => ({
    optionsList: {
      padding: '0 1.25rem',
    },
    optionItem: {
      paddingLeft: '1.25rem',
      paddingRight: '1.25rem',
      '&:not(:last-of-type)': {
        borderBottom: `1px solid ${grey[200]}`,
      },
    },
    optionModalItem: {
      whiteSpace: 'normal',
      '&:not(:last-of-type)': {
        borderBottom: `1px solid ${grey[200]}`,
      },
    },
  }),
  { name: 'UI-KIT-Select' },
);

export { useStyles };
