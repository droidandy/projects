import { makeStyles } from '@material-ui/core/styles';
import { Theme as DefaultTheme } from '@material-ui/core/styles/createMuiTheme';

interface Props {
  isExpanded: boolean;
}
export const useStyles = makeStyles<DefaultTheme, Props>(
  ({ breakpoints: { down }, palette: { primary, common, grey }, typography }) => ({
    childrenWrapper: {
      padding: '1rem 0',
      color: grey['600'],
      ...typography.body1,
      [down('xs')]: {
        marginLeft: '-0.75rem',
      },
    },
    additionText: {
      fontWeight: 600,
    },
    accordionSummary: {
      flexDirection: 'row-reverse',
      [down('xs')]: {
        maxHeight: 'unset',
        padding: '0',
      },
    },
    accordionItemDot: {
      height: '0.875rem',
      width: '0.875rem',
      backgroundColor: ({ isExpanded }) => (isExpanded ? common.white : primary.main),
      border: `0.25rem solid ${primary.main}`,
      borderRadius: '50%',
      [down('xs')]: {
        height: '0.5rem',
        width: '0.5rem',
        border: `0.15rem solid ${primary.main}`,
      },
    },
    accordionTexts: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
    },
    accordionTitle: {
      ...typography.subtitle1,
      marginLeft: '1.25rem',
      '&:hover': {
        textDecoration: 'underline',
      },
      [down('xs')]: {
        ...typography.body1,
        fontWeight: 700,
      },
    },
  }),
  { name: 'AccordionItem' },
);
