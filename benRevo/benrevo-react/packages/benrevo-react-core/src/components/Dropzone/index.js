/**
 *
 * DropZone
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';

class DropzoneElem extends React.PureComponent {
  static propTypes = {
    accept: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    errorName: PropTypes.string,
    onDrop: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    files: PropTypes.array.isRequired,
    planFiles: PropTypes.object,
    minSize: PropTypes.number,
    maxSize: PropTypes.number,
    totalFiles: PropTypes.number,
    multiple: PropTypes.bool,
  };

  static defaultProps = {
    multiple: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      error: false,
      errorSize: false,
      errorSizeTotal: false,
      errorTotalFiles: false,
      errorName: false,
    };

    this.onDrop = this.onDrop.bind(this);
    this.onRemove = this.onRemove.bind(this);

    this.mimeTypes = {
      pdf: 'application/pdf',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword',
      xlsm: 'application/vnd.ms-excel.sheet.macroEnabled.12',
    };
  }

  componentWillUpdate() {}

  onDrop(acceptedFiles, rejectedFiles) {
    const files = acceptedFiles.concat(rejectedFiles);
    if (!files.length) return;

    let errorName = false;
    let error = !this.checkExtension(files[0]);
    const size = files[0].size;

    if (!error) errorName = this.checkName(files[0].name);

    if (errorName) error = true;
    if (error && errorName) this.setState({ errorName: true, errorSize: false, errorTotalFiles: false });
    else if (this.props.files.length + 1 > this.props.totalFiles) {
      error = true;
      this.setState({ errorTotalFiles: true, errorSize: false, errorName: false });
    } else if (size > this.props.maxSize) {
      error = true;
      this.setState({ errorSize: true, errorTotalFiles: false, errorName: false });
    } else this.setState({ errorSize: false, errorName: false, errorTotalFiles: false });

    if (!error) {
      this.props.onDrop(files);
    }
    this.setState({ error });
  }

  onRemove(index) {
    this.props.onRemove(index);

    this.setState({ error: false, errorSizeTotal: false, errorSize: false, errorTotalFiles: false });
  }

  checkExtension(file) {
    const validExtensions = ['pdf', 'docx', 'xlsx', 'doc', 'xls', 'xlsm']; // array of valid extensions
    const fileName = file.name;
    const fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);

    for (let i = 0; i < validExtensions.length; i += 1) {
      if (fileNameExt.toLowerCase() === validExtensions[i].toLowerCase()) {
        return true;
      }
    }

    return false;
  }

  checkName(name) {
    let valid = true;
    const typeName = this.props.name;

    if (typeName === 'planFiles') {
      Object.keys(this.props.planFiles).map((index) => {
        this.props.planFiles[index].map((item) => {
          if (item.name === name) {
            valid = false;
            return false;
          }
          return true;
        });

        return true;
      });
    } else {
      this.props[typeName].map((item) => {
        if (item.name === name) {
          valid = false;
          return false;
        }

        return true;
      });
    }

    return !valid;
  }

  render() {
    const exts = this.props.accept.replace(/\s*/g, '').split(',');
    let accept = '';

    exts.map((item, i) => {
      accept += this.mimeTypes[item];

      if (i < exts.length - 1) accept += ',';

      return true;
    });


    return (
      <div className="drop-zone" name={this.props.errorName}>
        <Dropzone
          accept={accept}
          maxSize={this.props.maxSize}
          minSize={this.props.minSize}
          onDrop={this.onDrop}
          className="drop-zone-inner"
          activeClassName="active"
          rejectClassName="reject"
          multiple={this.props.multiple}
        >
          <Button content="Upload summary" icon="plus" labelPosition="right" />
          {this.state.error && this.state.errorName &&
            <div className="drop-zone-error one">You have already uploaded a file with that name</div>
          }
          {this.state.error && !this.state.errorSize && !this.state.errorName && !this.state.errorTotalFiles &&
            <span className="drop-zone-error two">Unsupported file type</span>
          }
          {this.state.error && this.state.errorSize &&
            <span className="drop-zone-error tree">File size cannot exceed 5 MB</span>
          }
          {this.state.error && this.state.errorTotalFiles &&
            <span className="drop-zone-error four">You can upload up to {this.props.totalFiles} files.</span>
          }
        </Dropzone>
        {this.props.files.map((item, i) =>
          <div key={i} className="drop-zone-file-item">
            <span className="drop-zone-file-item-title">Loaded file: {item.name}</span>
            <span className="drop-zone-size">({((item.size / 1024) / 1024).toFixed(3)} MB)</span>
            <button className="drop-zone-remove" onClick={() => { this.onRemove(i); }} >Remove</button>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const section = ownProps.section;
  const commonFiles = state.get('rfpFiles').get('common');
  const sectionFiles = state.get('rfpFiles').get(section);

  if (section) {
    return {
      totalSize: commonFiles.get('totalSize'),
      totalFiles: commonFiles.get('totalFiles'),
      currentSize: commonFiles.get('currentSize'),
      filesSummary: sectionFiles.get('filesSummary').toJS(),
      filesCensus: sectionFiles.get('filesCensus').toJS(),
      filesClaims: sectionFiles.get('filesClaims').toJS(),
      filesCurrentCarriers: sectionFiles.get('filesCurrentCarriers').toJS(),
      planFiles: sectionFiles.get('planFiles').toJS(),
    };
  }
  return {};
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(DropzoneElem);
