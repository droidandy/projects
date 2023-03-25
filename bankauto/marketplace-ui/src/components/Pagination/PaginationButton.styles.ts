import { makeStyles, Theme } from '@material-ui/core/styles';

type StyleProps = { withText: boolean | undefined };

const useStyles = makeStyles<Theme, StyleProps>(
  () => ({
    root: {
      minWidth: 'initial',
      fontWeight: 'bold',
      borderRadius: '.25rem',
      padding: '.5rem 1rem',
    },
    text: {},
    contained: {},
    startIcon: ({ withText }) => ({
      height: '1.5rem',
      alignItems: 'center',
      ...(!withText
        ? {
            margin: 0,
          }
        : {}),
    }),
    endIcon: ({ withText }) => ({
      height: '1.5rem',
      alignItems: 'center',
      ...(!withText
        ? {
            margin: 0,
          }
        : {}),
    }),
    iconSizeMedium: {
      '& > *:first-child': {
        fontSize: '1rem',
      },
    },
  }),
  { name: 'OFFICE-PaginationButton' },
);

export { useStyles };
