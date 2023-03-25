import { makeStyles } from '@material-ui/core/styles';

export const useStylesDropzone = makeStyles(
  () => ({
    root: {},
    dragActive: {},
    dragAccept: {},
    dragReject: {},
  }),
  { name: 'InputImageDropzone' },
);

export type DropzoneClasses = ReturnType<typeof useStylesDropzone>;
