import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Grid, Dimmer, Loader, Segment, Button, Header, Table } from 'semantic-ui-react';
import Helmet from 'react-helmet';

class Files extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loadingFilesPage: PropTypes.bool.isRequired,
    getFiles: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    files: PropTypes.array.isRequired,
    loadingFiles: PropTypes.object.isRequired,
    currentBroker: PropTypes.object.isRequired,
    selectedClient: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { getFiles } = this.props;
    getFiles();
  }

  render() {
    const { files, next, currentBroker, selectedClient, downloadFile, loadingFilesPage, loadingFiles } = this.props;
    return (
      <div className="plans-files">
        <Helmet
          title="Files"
          meta={[
            { name: 'description', content: 'Description of Plan Files' },
          ]}
        />

        <Grid stackable as={Segment} className="gridSegment">

          <Grid.Row className="header-second">
            <Header as="h1">{currentBroker.name} - {selectedClient.clientName}</Header>
          </Grid.Row>
          <Grid.Row className="header-main">
            <Header as="h2">Files</Header>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row className="table-row">
            <Dimmer active={loadingFilesPage} inverted>
              <Loader indeterminate size="big">Getting files</Loader>
            </Dimmer>
            { files.length > 0 &&
              <Table className="data-table">
                <Table.Header>
                  <Table.Row className="data-table-head">
                    <Table.HeaderCell colSpan="1">Date</Table.HeaderCell>
                    <Table.HeaderCell colSpan="4">File name</Table.HeaderCell>
                    <Table.HeaderCell colSpan="2"> </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {files.map((file, index) =>
                    <Table.Row key={index} className="data-table-body">
                      <Table.Cell collapsing colSpan="1">
                        {moment(file.created).format('MM.DD.YYYY')}
                      </Table.Cell>
                      <Table.Cell colSpan="4">
                        {file.name}
                      </Table.Cell>
                      <Table.Cell collapsing colSpan="1" textAlign="center">
                        { !loadingFiles[file.link] && <Button primary size="tiny" onClick={() => { downloadFile(file); }}>Download</Button> }
                        <Loader inline active={loadingFiles[file.link]} />
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
              }
            { !files.length && !loadingFilesPage &&
              <div className="empty">
                No files for this client
              </div>
            }
          </Grid.Row>
        </Grid>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10} only="computer">
            </Grid.Column>
            <Grid.Column tablet={16} computer={6}>
              <Button primary size="big" onClick={next}>Continue</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Files;
