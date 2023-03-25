import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';

function Dropzone({ className, children, dragActiveRender, onDropFiles, ...props }) {
  const onDrop = useCallback(acceptedFiles => {
    onDropFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ ...props, onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className={classNames('dropzone', className, { 'drag-active': isDragActive })}>
        {isDragActive
          ? dragActiveRender
            ? dragActiveRender()
            : 'Drop the files here...'
          : children}
      </div>
    </div>
  );
}

export default Dropzone;
