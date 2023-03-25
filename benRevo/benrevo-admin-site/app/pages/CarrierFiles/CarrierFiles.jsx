import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Helmet from 'react-helmet';
import { Grid, Dimmer, Loader, Segment, Button, Header, Table, Input, Modal, Form, Popup, Dropdown, Select } from 'semantic-ui-react';
import Navigation from '../../pages/Client/Navigation';
import Dropzone from '../../components/Dropzone';

class CarrierFiles extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    uploadingFiles: PropTypes.bool.isRequired,
    search: PropTypes.string.isRequired,
    getFiles: PropTypes.func.isRequired,
    changeSearchTag: PropTypes.func.isRequired,
    getCarrier: PropTypes.func.isRequired,
    changeCarrier: PropTypes.func.isRequired,
    changeSearch: PropTypes.func.isRequired,
    uploadFiles: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    removeFile: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
    getTags: PropTypes.func.isRequired,
    addFiles: PropTypes.func.isRequired,
    changeTags: PropTypes.func.isRequired,
    files: PropTypes.array.isRequired,
    tagList: PropTypes.array.isRequired,
    tag: PropTypes.string.isRequired,
    tags: PropTypes.object.isRequired,
    selectedCarrier: PropTypes.object.isRequired,
    blobs: PropTypes.array.isRequired,
    carriers: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      documentId: null,
      index: null,
      changingCarrier: false,
    };
    this.search = this.search.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.changeCarrier = this.changeCarrier.bind(this);
  }

  componentWillMount() {
    this.props.getTags();
    this.props.getCarrier();
  }

  componentWillReceiveProps() {
    if (this.state.changingCarrier) {
      this.setState({ changingCarrier: false }, () => {
        this.search();
      });
    }
  }

  onDelete() {
    this.props.deleteFile(this.state.documentId, this.state.index);
    this.onCancel();
  }

  onCancel() {
    this.setState({ open: false, documentId: null, index: null });
  }

  search() {
    const { tag } = this.props;
    const value = tag.value || '';
    this.props.getFiles(value);
  }

  changeCarrier(value) {
    this.setState({ changingCarrier: true }, () => {
      this.props.changeCarrier(value);
    });
  }

  render() {
    const {
      loading,
      carriers,
      uploadingFiles,
      files,
      search,
      changeSearch,
      uploadFiles,
      downloadFile,
      addFiles,
      blobs,
      removeFile,
      tagList,
      changeTags,
      tags,
      selectedCarrier,
      tag,
      changeSearchTag,
    } = this.props;
    const carrierList = carriers.map((item) => ({
      key: item.carrierId,
      value: item.carrierId,
      text: item.displayName,
    })).sort((a, b) => {
      if (a.text < b.text) {
        return -1;
      }
      if (a.text > b.text) {
        return 1;
      }
      return 0;
    });
    const searchTagList = [...tagList];

    searchTagList.unshift({
      key: 'All',
      value: 'All',
      text: 'All',
    });

    return (
      <div className="carrier-files">
        <Helmet
          title="Carrier Files"
          meta={[
            { name: 'description', content: 'Carrier Files' },
          ]}
        />
        <Navigation />
        <Grid stackable container className="requests section-wrap carrierFiles" key="carrierFiles">
          <Grid.Row>
            <Grid.Column width={16}>
              <Grid stackable as={Segment} className="gridSegment">
                <Grid.Row className="header-main">
                  <Header as="h2">Carrier Files</Header>
                  <Dropdown
                    className="carrier-dropdown"
                    placeholder="Choose"
                    search
                    selection
                    options={carrierList}
                    value={selectedCarrier.carrierId}
                    onChange={(e, inputState) => { this.changeCarrier(inputState.value); }}
                  />
                  <div className="divider" />
                </Grid.Row>
                <Grid.Row className="table-row">
                  <Input type="text" className="search-field" placeholder="Search..." action>
                    <Select
                      className="tag-list-select"
                      onChange={(e, inputState) => { changeSearchTag(inputState.value); }}
                      compact
                      selection
                      search
                      options={searchTagList}
                      value={tag}
                    />
                    <input className="tag-list-input" value={search} onChange={(e) => { changeSearch(e.target.value); }} />
                    <Button type="submit" onClick={this.search} >Search</Button>
                  </Input>
                  <Dimmer active={loading} inverted>
                    <Loader indeterminate size="big">Getting files</Loader>
                  </Dimmer>
                  <Table className="data-table" unstackable fixed>
                    <Table.Header>
                      <Table.Row className="data-table-head">
                        <Table.HeaderCell width="8">File Name</Table.HeaderCell>
                        <Table.HeaderCell width="3">Tags</Table.HeaderCell>
                        <Table.HeaderCell width="2">Last Update</Table.HeaderCell>
                        <Table.HeaderCell width="3" />
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      { files.length > 0 && files.map((file, index) =>
                        <Table.Row key={index} className="data-table-body">
                          <Table.Cell collapsing singleLine>
                            <Popup
                              className="filename-name-popup"
                              position="top center"
                              trigger={<span>{file.fileName}</span>}
                              content={file.fileName}
                              inverted
                              flowing
                              hoverable
                              wide
                            />
                          </Table.Cell>
                          <Table.Cell collapsing singleLine={false}>
                            <Popup
                              className="filename-name-popup"
                              position="top center"
                              trigger={<span>{file.tags && file.tags.join(', ')}</span>}
                              content={file.tags && file.tags.join(', ')}
                              inverted
                              flowing
                              hoverable
                              wide
                            />
                          </Table.Cell>
                          <Table.Cell collapsing>
                            {moment(new Date(file.lastUpdated)).format('MM.DD.YYYY')}
                          </Table.Cell>
                          <Table.Cell collapsing textAlign="center">
                            <Button className="download-button" primary size="tiny" onClick={() => { downloadFile(file); }}>Download File</Button>
                            <Button className="remove-button" onClick={() => { this.setState({ documentId: file.documentId, index, open: true }); }}>X</Button>
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table>
                  { !files.length && !loading &&
                  <div className="empty">
                    No files
                  </div>
                  }
                </Grid.Row>
              </Grid>

              <Grid stackable as={Segment} className="gridSegment" key="uploadingFiles">
                <Grid.Row className="header-main">
                  <Header as="h2">Upload File(s)</Header>
                  <div className="divider" />
                </Grid.Row>
                <Grid.Row>
                  <Dimmer active={uploadingFiles} inverted>
                    <Loader indeterminate size="big">Getting files</Loader>
                  </Dimmer>
                  <Dropzone
                    accept="pdf, xlsx, docx"
                    multiple
                    files={blobs}
                    maxSize={5242880}
                    onDrop={addFiles}
                    tagList={tagList}
                    tags={tags}
                    onRemove={removeFile}
                    onChangeTags={changeTags}
                  />
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width="12" />
                  <Grid.Column width="4">
                    <Button disabled={!blobs.length} primary size="big" onClick={uploadFiles}>Upload</Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Modal
          className="carrier-files-remove-modal"
          open={this.state.open}
          dimmer="inverted"
          size="small"
        >
          <Modal.Content>
            <Grid stackable>
              <Grid.Row stretched className="header-main">
                <Grid.Column width={16}>
                  <Header as="h2">Are you sure you want to delete the document?</Header>
                </Grid.Column>
                <Grid.Column width={16}>
                  <Form onSubmit={(e) => { e.preventDefault(); }}>
                    <Form.Group inline className="buttons">
                      <Button size="big" primary onClick={this.onDelete}>OK</Button>
                      <Button size="big" basic onClick={this.onCancel}>Cancel</Button>
                    </Form.Group>
                  </Form>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default CarrierFiles;
