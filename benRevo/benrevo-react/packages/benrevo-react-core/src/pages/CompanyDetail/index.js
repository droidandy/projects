/*
 *
 * CompanyDetailPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Grid, Header } from 'semantic-ui-react';
import { createStructuredSelector } from 'reselect';
import { makeSelectCompanyDetailPage } from './selectors';
import { Container } from './Container';

export class CompanyDetailPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet
          title="CompanyDetailPage"
          meta={[
            { name: 'description', content: 'Description of CompanyDetailPage' },
          ]}
        />
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={12}>
              <Container>
                <Header textAlign="left" as="h2">Clients</Header>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

CompanyDetailPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  CompanyDetailPage: makeSelectCompanyDetailPage,
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyDetailPage);
