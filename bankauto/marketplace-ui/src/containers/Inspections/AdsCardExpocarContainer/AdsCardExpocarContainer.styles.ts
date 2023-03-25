import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ breakpoints: { down }, palette: { grey } }) => {
    return {
      root: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'stretch',
        margin: '0.625rem',
        height: '100%',
        background: grey['200'],
        borderRadius: '0.5rem',
        overflow: 'hidden',
        padding: '2.5rem',
        [down('xs')]: {
          padding: '1.25rem',
          flexDirection: 'column',
        },
      },
      imageWrapper: {
        position: 'relative',
        width: '100%',
        borderRadius: '0.5rem',
        minWidth: '20.3125rem',
        maxWidth: '20.3125rem',
        minHeight: '12.5rem',
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
      container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
      },
      contentWrapper: {
        paddingBottom: '1.25rem',
        [down('xs')]: {
          paddingTop: '0.625rem',
        },
      },
      titleWrapper: {
        display: 'flex',
        alignItems: 'center',
        [down('xs')]: {
          marginBottom: '0.625rem',
        },
      },
      inspectionInfoWrapper: {
        [down('xs')]: {
          paddingBottom: '1.25rem',
          borderBottom: '0.0625rem solid #fff',
        },
      },
      title: {
        marginRight: '0.625rem',
      },
      description: {
        paddingTop: '0.625rem',
      },
      aboutLink: {
        paddingTop: '1.25rem',
      },
      buttonContainer: {
        display: 'flex',
        alignItems: 'center',
        [down('xs')]: {
          flexDirection: 'column',
        },
      },
      buttonItemContained: {
        marginRight: '2.5rem',
        width: '22.8125rem',
        [down('xs')]: {
          width: '100%',
          marginRight: '0',
          marginBottom: '0.625rem',
        },
      },
      mainButton: {
        padding: '0.5rem 1.375rem',
      },
    };
  },
  {
    name: 'AdsCardExpocarContainer',
  },
);

export { useStyles };
