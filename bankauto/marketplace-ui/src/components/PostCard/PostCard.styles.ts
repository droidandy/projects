import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints, palette }) => ({
    postCardWrapper: {
      overflow: 'hidden',
      cursor: 'pointer',
    },
    imageWrapper: {
      position: 'relative',
      height: '18.75rem',
      overflow: 'hidden',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      borderRadius: '.5rem',
      [breakpoints.down('xs')]: {
        height: '10.625rem',
      },
    },
    metaWrapper: {
      marginTop: '1.25rem',
      [breakpoints.down('xs')]: {
        marginTop: '0.625rem',
      },
    },
    title: {
      marginTop: '0.625rem',
      color: palette.text.primary,

      [breakpoints.up('sm')]: {
        fontSize: '1.5rem',
        lineHeight: '1.875rem',
      },
    },
    category: {
      color: palette.primary.main,
      marginRight: '0.625rem',
    },
    date: {
      color: palette.grey['500'],
    },
  }),
  {
    name: 'PostCard',
  },
);

export { useStyles };
