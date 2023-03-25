import { makeStyles } from '@material-ui/core/styles';
import { Props } from './FinanceCard.types';

type StyleProps = Pick<Props, 'direction' | 'link' | 'transparent'>;

const useStyles = makeStyles(
  ({
    breakpoints: { down },
    palette: {
      primary: { main },
      common: { white, black },
    },
  }) => ({
    box: {
      width: '22.8125rem',
      flexShrink: 1,
      flexGrow: 1,
      padding: ({ transparent }: StyleProps) => (transparent ? 0 : '1.875rem'),
      paddingRight: ({ transparent }: StyleProps) => (transparent ? 0 : '0.25rem'),
      display: 'flex',
      alignItems: 'center',
      flexDirection: ({ direction }: StyleProps) => direction,
      textAlign: ({ direction }: StyleProps) => (direction === 'row' ? 'left' : 'center'),
      cursor: ({ link }: StyleProps) => (link ? 'pointer' : 'default'),
      borderRadius: '8px',
      background: ({ transparent }: StyleProps) => (transparent ? 'transparent' : white),
      boxShadow: ({ transparent }: StyleProps) => (transparent ? 'none' : '0px 8px 48px rgba(0, 0, 0, 0.1)'),
      [down('xs')]: {
        width: '20.94rem',
        maxWidth: '100%',
        padding: '1.25rem',
        paddingBottom: '1.125rem',
      },
    },
    icon: {
      width: '3.75rem',
      height: '3.75rem',
      margin: ({ direction }: StyleProps) => (direction === 'row' ? '0 1.25rem 0 0' : '0 0 0.5rem'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '4px',
      backgroundColor: ({ transparent }: StyleProps) => (transparent ? 'transparent' : main),
      [down('xs')]: {
        width: '2.5rem',
        height: '2.5rem',
      },
    },
    title: {
      fontWeight: 'bold',
      fontSize: '1.25rem',
      lineHeight: 1.5,
      marginBottom: ({ direction }: StyleProps) => (direction === 'row' ? 0 : '0.625rem'),
      color: ({ transparent }: StyleProps) => (transparent ? white : black),
      [down('xs')]: {
        fontSize: '1rem',
      },
    },
    subTitle: {
      color: ({ transparent }: StyleProps) => (transparent ? white : main),
      padding: ({ transparent }: StyleProps) => (transparent ? '0 3.75rem' : 0),
      fontSize: '0.875rem',
      lineHeight: 1.4285,
    },
  }),
);

export { useStyles };
