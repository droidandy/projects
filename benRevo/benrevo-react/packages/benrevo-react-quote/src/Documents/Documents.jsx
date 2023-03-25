import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Segment, Dimmer, Loader } from 'semantic-ui-react';
import { Link } from 'react-router';

class Documents extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    getFile: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    client: PropTypes.object.isRequired,
    baseLink: PropTypes.string,
  };

  render() {
    const { loading, data, getFile, baseLink, client } = this.props;
    const link = baseLink || `/presentation/${client.id}`;

    return (
      <div className="presentation-documents">
        <div className="breadcrumb">
          <Link to={`${link}/quote`}>Quote Summary</Link>
          <span> > </span>
          <a className="breadcrumbOptionName">Documents</a>
        </div>
        <div className="divider"></div>
        <Grid stackable columns={2} as={Segment} className="gridSegment">
          <Dimmer active={loading} inverted>
            <Loader indeterminate size="big">Fetching documents</Loader>
          </Dimmer>
          <Grid.Row >
            <Grid.Column width="16">
              <div className="page-heading-top">
                <Header as="h1" className="page-heading">Documents</Header>
              </div>
            </Grid.Column>
          </Grid.Row>
          { data.all.map((item, i) =>
            <Grid.Row key={i} className={`document-item ${i === data.all.length - 1 ? 'last ' : ''}`}>
              <Grid.Column width="16">
                <a role="button" tabIndex={0} onClick={() => { getFile(item); }}>{item.fileName}</a>
              </Grid.Column>
            </Grid.Row>
          )}
          { data.north.length > 0 &&
            <div className="document-title">
              North Cal:
            </div>
          }
          { data.north.map((item, i) =>
            <Grid.Row key={i} className={`document-item ${i === data.north.length - 1 ? 'last ' : ''}`}>
              <Grid.Column width="16">
                <a role="button" tabIndex={0} onClick={() => { getFile(item); }}>{item.fileName}</a>
              </Grid.Column>
            </Grid.Row>
          )}
          { data.south.length > 0 &&
            <div className="document-title">
              South Cal:
            </div>
          }
          { data.south.map((item, i) =>
            <Grid.Row key={i} className={`document-item ${i === data.south.length - 1 ? 'last ' : ''}`}>
              <Grid.Column width="16">
                <a role="button" tabIndex={0} onClick={() => { getFile(item); }}>{item.fileName}</a>
              </Grid.Column>
            </Grid.Row>
          )}
          { !data.all.length && !data.south.length && !data.north.length && !loading &&
            <Grid.Row className="empty">
              <Grid.Column width="16" textAlign="center">
                No documents
              </Grid.Column>
            </Grid.Row>
          }
        </Grid>
      </div>
    );
  }
}

export default Documents;
