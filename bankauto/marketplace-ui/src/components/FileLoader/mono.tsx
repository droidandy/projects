import React, { useMemo, useCallback, memo, FC, useEffect, useRef, ChangeEventHandler } from 'react';
import Grid, { GridSize } from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { loadInitialFiles } from './utils';
import { FileObject, FileStatus } from './types';
import { LoaderConfigProps } from './ConfigProvider';
import Dropzone, { FileModifier, DropHandler, DropzoneContext } from './Dropzone';
import { Entry } from './components/entry';
import LoaderError from './ErrorModel';
import { DndWrapper } from './DnD';
import { LoaderPreviewItem } from './LoaderPreview';
import { fireEvent } from './Event/events';
import { useReducerCollection, useCollectionStateApi } from './ComponentState/collection';

interface LoaderFieldProps {
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  error?: string;
  defaultValue?: string | null;
}

interface FileLoaderProps extends Partial<LoaderConfigProps>, LoaderFieldProps {
  description?: string;
  xs?: GridSize;
  sm?: GridSize;
  upload?: <T extends File>(file: T) => Promise<string>;
}

const ACCEPTED_FILES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', '.HEIC', '.heic'];
const ACCEPTED_FILES_TYPE = ACCEPTED_FILES.join(',');
const hashSep = ',';

const FileLoaderMono: FC<FileLoaderProps> = memo(
  ({
    name,
    upload,
    onChange,
    error,
    defaultValue,
    accept = ACCEPTED_FILES_TYPE,
    maxSize = 33554432,
    maxFiles = 0,
    orientation,
    description,
    xs = 6,
    sm = 3,
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    // prepare config context value
    const multiple = useMemo(() => !maxFiles || maxFiles > 1, [maxFiles]);
    const initialStatus = useMemo<FileStatus>(() => (upload ? 'initial' : 'accepted'), []);

    const [files, dispatch] = useReducerCollection<FileObject>([]);
    const collectionApi = useCollectionStateApi(files);
    // advanced state properties
    const { current: storeApi } = useRef({
      move(id: string, atIndex: number) {
        dispatch({ type: 'move', payload: { id, atIndex } });
      },
      remove(id: string) {
        dispatch({ type: 'remove', payload: { id } });
      },
      add(items: FileObject[], skipIdentical?: boolean) {
        dispatch({ type: 'add', payload: { items, skipIdentical } });
      },
      update(id: string, props: Partial<FileObject>) {
        dispatch({ type: 'update', payload: { id, props } });
      },
      get filesProcessing(): FileObject[] {
        return collectionApi.findBy('status', initialStatus);
      },
      get filesResolved(): FileObject[] {
        return collectionApi.findBy('status', 'accepted');
      },
      get leftCount() {
        return Math.max(
          maxFiles -
            collectionApi.findBy('status', initialStatus).length -
            collectionApi.findBy('status', 'accepted').length,
          0,
        );
      },
    });
    const [hashProcessing, hashResolved, leftCount, disabled] = useMemo(() => {
      return [
        storeApi.filesProcessing.map((f) => f.src).join(hashSep),
        storeApi.filesResolved.map((f) => f.src).join(hashSep),
        storeApi.leftCount,
        !storeApi.leftCount,
      ] as const;
    }, [files]);

    // create default file objects
    useEffect(() => {
      loadInitialFiles(defaultValue ? defaultValue.split(',') : []).then(storeApi.add);
    }, []);

    // call onChange event
    useEffect(() => {
      if (inputRef.current) {
        fireEvent.change(inputRef.current, { target: { value: hashResolved } });
      }
    }, [hashResolved]);

    // added files processing (upload)
    /* todo - batch update when all Settled */
    useEffect(() => {
      if (upload && hashProcessing) {
        const processing = (file: FileObject) =>
          upload(file).catch(() => {
            throw new Error('upload-error');
          });
        const itemsToProcess = [...storeApi.filesProcessing];
        if (itemsToProcess.length) {
          dispatch({
            type: 'updateBatch',
            payload: { items: itemsToProcess.map(({ id }) => ({ id, status: 'loading' })) },
          });
          itemsToProcess.forEach((file) =>
            processing(file)
              .then((result) =>
                storeApi.update(file.id, {
                  status: 'accepted',
                  src: result,
                }),
              )
              .catch((e) =>
                storeApi.update(file.id, {
                  status: 'rejected',
                  message: LoaderError(e.message).message,
                }),
              ),
          );
        }
      }
    }, [hashProcessing]);

    // clear browser memory (URL)
    useEffect(() => {
      return () => files.forEach((item) => URL.revokeObjectURL(item.src));
    }, [files]);

    // dropzone handlers
    const dropHandler = useCallback<DropHandler<FileObject>>(
      (accepted, rejections) => {
        const limitCode = 'too-many-files';
        const acceptedFiles: FileObject[] = [...accepted];
        const rejectedFiles: FileObject[] = [];
        // make accepted items those was rejected by limit
        rejections.forEach((rejection) => {
          const isRejectedByLimit = rejection.errors.map((e) => e.code).includes(limitCode);
          if (isRejectedByLimit) {
            acceptedFiles.push(Object.assign(rejection.file, { status: initialStatus }));
          } else {
            rejectedFiles.push(
              Object.assign(rejection.file, {
                status: 'rejected' as FileStatus,
                message: LoaderError(rejection.errors[0].code).message,
              }),
            );
          }
        });
        // accept if it has left space
        const acceptedItems = acceptedFiles.splice(0, storeApi.leftCount);
        // move accepted tail to rejections
        if (multiple) {
          rejectedFiles.push(
            ...acceptedFiles.map((item) =>
              Object.assign(item, {
                status: 'rejected',
                message: LoaderError(limitCode).message,
              }),
            ),
          );
        }
        storeApi.add([...acceptedItems, ...rejectedFiles]);
      },
      [multiple],
    );

    const fileModifier = useCallback<FileModifier<File, FileObject>>(
      (file) =>
        Object.assign(file, {
          id: file.lastModified + file.name,
          options: { 'data-options': 'test' },
          src: URL.createObjectURL(file),
          status: initialStatus,
        }),
      [],
    );
    const renderPreviewItem = (item: FileObject) => {
      return multiple ? (
        <DndWrapper
          id={item.id}
          findIndex={collectionApi.findIndex}
          onMove={storeApi.move}
          component={LoaderPreviewItem}
          item={item}
          orientation={orientation}
          onRemove={storeApi.remove}
        />
      ) : (
        <LoaderPreviewItem item={item} onRemove={storeApi.remove} orientation={orientation} />
      );
    };
    const renderInput = () => {
      return (
        <DropzoneContext.Consumer>
          {({ isDragAccept, isDragReject, open }) => (
            <Entry onClick={open} isAccept={isDragAccept} isReject={isDragReject} orientation={orientation} />
          )}
        </DropzoneContext.Consumer>
      );
    };
    const renderGrid = () => {
      return files
        .map<[string, React.ReactNode]>((item) => [item.id, renderPreviewItem(item)])
        .concat([['loader-input-label', disabled ? null : renderInput()]])
        .map(([key, item], index) =>
          item ? (
            <Grid item sm={sm} xs={xs} key={key}>
              {item}
              {index === 0 && description ? (
                <Typography variant="caption" color="textSecondary">
                  <b>{description}</b>
                </Typography>
              ) : null}
            </Grid>
          ) : null,
        );
    };
    return (
      <Dropzone
        onDrop={dropHandler}
        accept={accept}
        maxSize={maxSize}
        maxFiles={leftCount}
        multiple={multiple}
        fileFromEventModifier={fileModifier}
        disabled={disabled}
        noClick
      >
        <Grid container spacing={4}>
          {renderGrid()}
        </Grid>
        {error ? (
          <Typography variant="caption" color="error">
            <b>{error}</b>
          </Typography>
        ) : null}
        <input
          type="text"
          ref={inputRef}
          name={name}
          onChange={onChange}
          autoComplete="off"
          tabIndex={-1}
          style={{ display: 'none' }}
        />
      </Dropzone>
    );
  },
  (prev, next) => prev.error == next.error,
);
FileLoaderMono.displayName = 'FileLoaderMono';
export default FileLoaderMono;
