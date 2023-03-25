/**
 *
 * DropZone
 *
 */

import React from 'react';
import Dropzone from 'react-dropzone';
import { Link } from 'react-router';
import { Button, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';

class DropzoneElem extends React.PureComponent {
  static propTypes = {
    accept: React.PropTypes.string.isRequired,
    files: React.PropTypes.array.isRequired,
    tagList: React.PropTypes.array.isRequired,
    tags: React.PropTypes.object.isRequired,
    onDrop: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired,
    onChangeTags: React.PropTypes.func.isRequired,
    minSize: React.PropTypes.number,
    maxSize: React.PropTypes.number,
    multiple: React.PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      error: false,
      errorSize: false,
    };

    this.onDrop = this.onDrop.bind(this);
    this.onClick = this.onClick.bind(this);

    this.mimeTypes = {
      pdf: 'application/pdf',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword',
    };
  }

  onDrop(acceptedFiles, rejectedFiles) {
    const files = acceptedFiles.concat(rejectedFiles);
    if (!files.length) return;

    let error = !this.checkExtension(files[0]);
    const size = files[0].size;

    if (size > this.props.maxSize) {
      error = true;
      this.setState({ errorSize: true });
    } else this.setState({ errorSize: false });

    if (!error) {
      this.props.onDrop(files);
    }
    this.setState({ error });
  }

  onClick() {
    this.dropzoneRef.open();
  }

  checkExtension(file) {
    const validExtensions = ['pdf', 'docx', 'xlsx', 'doc', 'xls']; // array of valid extensions
    const fileName = file.name;
    const fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);

    for (let i = 0; i < validExtensions.length; i += 1) {
      if (fileNameExt === validExtensions[i]) {
        return true;
      }
    }

    return false;
  }

  render() {
    const { files, maxSize, minSize, multiple, onRemove, tags, tagList, onChangeTags } = this.props;
    const exts = this.props.accept.replace(/\s*/g, '').split(',');
    let accept = '';

    exts.map((item, i) => {
      accept += this.mimeTypes[item];

      if (i < exts.length - 1) accept += ',';

      return true;
    });

    return (
      <div className="drop-zone">
        <Dropzone disableClick ref={(node) => { this.dropzoneRef = node; }} accept={accept} maxSize={maxSize} minSize={minSize} onDrop={this.onDrop} className="drop-zone-inner" activeClassName="active" rejectClassName="reject" multiple={multiple}>
          <div className="drop-zone-inner-top">
            <div className="select-files">To attach files drag & drop here or <Link onClick={this.onClick}>select files from your computer…</Link></div>
            {this.state.error && this.state.errorSize &&
            <span className="drop-zone-error">File size cannot exceed 5 MB</span>
            }
            {this.state.error && !this.state.errorSize &&
            <span className="drop-zone-error">Unsupported file type</span>
            }
          </div>
          {files.map((item, i) =>
            <div key={i} className="drop-zone-file-item">
              <Button className="remove-button" size="small" onClick={() => { onRemove(i); }}>X</Button>
              <span className="drop-zone-file-item-title">{item.name}</span>
              <Dropdown
                multiple
                search
                selection
                options={tagList}
                value={tags[i] || []}
                placeholder="Choose a tag"
                onChange={(e, inputState) => { onChangeTags(i, inputState.value); }}
              />
            </div>
          )}
        </Dropzone>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(DropzoneElem);
