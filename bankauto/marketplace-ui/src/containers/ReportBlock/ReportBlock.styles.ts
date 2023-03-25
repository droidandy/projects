import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette: { grey }, typography: { h5 } }) => {
    return {
      bordered: {
        border: `1px solid ${grey['200']}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem',
      },
      bookButton: {
        display: 'block',
        padding: '0.5rem',
        minHeight: '3.75rem',
        fontSize: h5.fontSize,
        lineHeight: h5.lineHeight,
        fontWeight: h5.fontWeight,
      },
      title: {
        padding: '1.25rem 0rem',
        fontWeight: 700,
        fontSize: h5.fontSize,
        lineHeight: h5.lineHeight,
      },
      teaserRoot: {
        padding: '1.25rem 0',
      },
      teaserItem: {
        paddingBottom: '1rem',
        '&:last-of-type': {
          paddingBottom: '0rem',
        },
      },
    };
  },
  { name: 'ReportBlock' },
);
