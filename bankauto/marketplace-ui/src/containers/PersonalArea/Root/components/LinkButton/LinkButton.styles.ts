import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({
    palette: {
      secondary: { light, main },
    },
  }) => ({
    button: {
      border: `1px solid ${light}`,
      borderRadius: '0.5rem',
      fontWeight: 'bold',
      fontSize: '1rem',
      '&:hover': {
        borderColor: main,
      },
    },
  }),
  { name: 'RootContainerLinkButton' },
);
