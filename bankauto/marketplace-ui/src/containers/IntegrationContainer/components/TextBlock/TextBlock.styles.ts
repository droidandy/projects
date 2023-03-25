import { makeStyles } from '@material-ui/core/styles';
import { Theme as DefaultTheme } from '@material-ui/core/styles/createMuiTheme';
interface Props {
  expanded: boolean;
}
export const useStyles = makeStyles<DefaultTheme, Props>(
  ({ breakpoints: { down }, typography }) => {
    return {
      root: {
        display: 'flex',
        maxWidth: '117rem',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-start',
      },
      textCollapse: {
        maxHeight: ({ expanded }) => (expanded ? '100%' : '0'),
        display: ({ expanded }) => (expanded ? 'block' : 'none'),
        transition: 'all 1s ease-in 2s',
      },
      title: {
        ...typography.h2,
        marginBottom: '1.5rem',
        [down('xs')]: {
          ...typography.h5,
        },
      },
      imageWrapper: {
        position: 'relative',
        width: '100%',
        minWidth: '28.125rem',
        maxWidth: '28.125rem',
        minHeight: '28.125rem',
        marginRight: '3.75rem',
        overflow: 'hidden',
        [down('xs')]: {
          height: '12.5rem',
          width: '100%',
          minWidth: 'auto',
          maxWidth: '100%',
          marginRight: 0,
        },
      },
      blockItem: {
        width: '50%',
        [down('xs')]: {
          width: '100%',
        },
      },
      divider: {
        paddingTop: '1rem',
      },
      expandIcon: {
        transform: ({ expanded }) => (expanded ? 'rotate(180deg)' : 'none'),
      },
      regularText: {
        marginBottom: '1rem',
      },
    };
  },
  {
    name: 'TextBlock',
  },
);
