import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header } from 'semantic-ui-react';
import ClientsListBody from './components/ClientsListBody';

class ClientsList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    getPreQuoted: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    NewRfps: PropTypes.array.isRequired,
    InProgress: PropTypes.array.isRequired,
    sort: PropTypes.object.isRequired,
    changePreQuotedSort: PropTypes.func.isRequired,
  };

  render() {
    const {
      getPreQuoted,
      loading,
      InProgress,
      NewRfps,
      sort,
      changePreQuotedSort,
      children,
    } = this.props;
    if (!children) {
      return (
        <div className="clients-list-page">
          <Header className="page-title">Clients - Pending Quote</Header>
          <Grid>
            <Grid.Row>
              <Grid.Column width="16">
                <ClientsListBody
                  getPreQuoted={getPreQuoted}
                  NewRfps={NewRfps}
                  InProgress={InProgress}
                  loading={loading}
                  sort={sort}
                  changePreQuotedSort={changePreQuotedSort}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );
    }

    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default ClientsList;
