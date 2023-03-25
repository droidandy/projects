import React, { useState, useCallback } from 'react';
import Dropzone from 'components/Dropzone';
import { Button } from 'reactstrap';

import parseCsv from 'lib/parseCsv';

const UpdateData = ({ onChangeData }) => {
  const [files, setFiles] = useState([]);

  const onDropFiles = useCallback(async files => {
    const data = await parseCsv(files[0]);
    onChangeData(data.data);
    setFiles(files);
  }, []);

  return (
    <div className="d-flex flex-row align-items-center">
      <Button className="mr-2" color="primary" disabled={files.length === 0}>
        Tag Start ups
      </Button>
      <Dropzone accept={['.csv', '.txt']} onDropFiles={onDropFiles}>
        {files && files.length ? (
          <React.Fragment>
            <i className="fa fa-upload" /> {files.map(file => file.name).join(', ')}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <i className="fa fa-upload" />
            <span>Update Data</span>
          </React.Fragment>
        )}
      </Dropzone>
    </div>
  );
};

export default UpdateData;
