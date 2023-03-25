import React, { createContext, useMemo } from 'react';
import { FileWithPath, fromEvent } from 'file-selector';
import {
  useDropzone,
  DropEvent,
  DropzoneOptions,
  DropzoneState,
  DropzoneRootProps,
  DropzoneInputProps,
  FileError,
} from 'react-dropzone';
import { DropzoneClasses } from './dropzone.styles';

export type { DropEvent } from 'react-dropzone';

export interface FileRejection<T extends File = File> {
  file: T;
  errors: FileError[];
}

export type DropzoneContextValues = Pick<DropzoneState, 'open' | 'isDragActive' | 'isDragAccept' | 'isDragReject'> & {
  isDisabled: boolean;
};
export const DropzoneContext = createContext<DropzoneContextValues>({
  isDragActive: false,
  isDragAccept: false,
  isDragReject: false,
  isDisabled: false,
  open: () => {},
});
DropzoneContext.displayName = 'DropzoneContext';

export type FileModifier<FM extends File = File, FR extends FM = FM> = (item: FM) => FR;
export type DropHandler<FR extends File> = <F extends FR>(
  acceptedFiles: FR[],
  fileRejections: FileRejection<FR>[],
  event: DropEvent,
) => void;

const isFileWithPath = <T extends FileWithPath>(item: T | any): item is FileWithPath => {
  return !!item.name;
};
const filesFromEventCreator =
  <T extends File, R extends T>(modifier: FileModifier<T, R>) =>
  async (event: DropEvent): Promise<(R | DataTransferItem)[]> =>
    fromEvent(event as Event).then((items) => items.map((item) => (isFileWithPath(item) ? modifier(item as T) : item)));

export type DropzoneProps<T extends File, R extends T> = Omit<DropzoneOptions, 'onDrop' | 'getFilesFromEvent'> & {
  inputElementProps?: DropzoneInputProps;
  rootElementProps?: DropzoneRootProps;
  children?: ((props: DropzoneContextValues) => React.ReactNode) | React.ReactNode;
  classes?: Partial<DropzoneClasses>;
  fileFromEventModifier: FileModifier<T, R>;
  onDrop?: DropHandler<R>;
};

const Dropzone = <F extends File = File, R extends F = F>({
  fileFromEventModifier,
  children,
  classes: propClasses,
  rootElementProps,
  inputElementProps,
  onDrop,
  disabled,
  ...dropzoneProps
}: DropzoneProps<F, R>) => {
  // Dropzone is not available for rewrite DropzoneOptions. So it is fixed by this hok
  // - pass T as R - (TypeFromDropzone that generates by FileModifier Response)
  const dropHandler = <T extends File>(accepted: T[], rejected: FileRejection<T>[], event: DropEvent) => {
    if (onDrop) {
      onDrop(accepted as never, rejected as never, event);
    }
  };
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open } = useDropzone({
    getFilesFromEvent: filesFromEventCreator<F, R>(fileFromEventModifier),
    onDrop: dropHandler,
    disabled,
    ...dropzoneProps,
  }); // (dropzoneProps);

  const value = useMemo(
    () => ({ isDragAccept, isDragReject, isDragActive, isDisabled: !!disabled, open }),
    [isDragAccept, isDragReject, isDragActive, disabled, open],
  );
  return (
    <div {...getRootProps(rootElementProps)}>
      <DropzoneContext.Provider value={value}>{children}</DropzoneContext.Provider>
      <input {...getInputProps(inputElementProps)} />
    </div>
  );
};
export default Dropzone;
