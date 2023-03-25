import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Card, Button, Loader } from 'semantic-ui-react';
import ClientsListTable from '../../ClientsList/components/ClientsListTable';

class ClientListsBody extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    getPreQuoted: PropTypes.func.isRequired,
    NewRfps: PropTypes.array.isRequired,
    InProgress: PropTypes.array.isRequired,
    sort: PropTypes.object.isRequired,
    changePreQuotedSort: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { getPreQuoted } = this.props;
    getPreQuoted();
  }

  render() {
    const { loading, NewRfps, InProgress, sort, changePreQuotedSort } = this.props;
    return (
      <Card className="card-main clients" fluid>
        <Card.Content>
          <Card.Header>
            <div className="header-actions">
              <Button
                as={Link}
                to="/prequote/clients/new"
                primary
              >Create New Client
              </Button>
            </div>
          </Card.Header>
          { !loading && <ClientsListTable
            InProgress={InProgress}
            NewRfps={NewRfps}
            sort={sort}
            changePreQuotedSort={changePreQuotedSort}
          /> }
          { loading &&
          <div className="empty">
            <Loader inline indeterminate active={loading} size="big">Fetching data</Loader>
          </div>
          }
        </Card.Content>
      </Card>
    );
  }
}

export default ClientListsBody;
