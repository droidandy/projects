// @flow
import React from 'react';
import File, { type FileT } from 'components/general/Files/File';

export type FilesProps = {
  files: FileT[],
};

export default ({ files }: FilesProps) =>
  <div className="mt-0 mb-3 d-flex flex-column">
    {/* TODO: keys */}
    {files.map(({ name, pathToFile }, index) =>
      <File key={`file-${index}`} name={name} pathToFile={pathToFile} />
    )}
  </div>;
