import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Link } from 'react-router';
import { Grid, Container, Header } from 'semantic-ui-react';
import messages from './messages';

class Footer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    return (
      <div className="app-footer">
        <ul className="footer-top">
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
        </ul>
        <div className="app-footer-bottom">
          <Container>
            <Grid centered stackable textAlign="center">
              <Grid.Row centered>
                <Grid.Column width={4}>
                  <span className="logo" />
                </Grid.Column>
                <Grid.Column width={3}>
                  <Header className="column-header"><FormattedMessage {...messages.product} /></Header>
                  <Link className="column-item" to="/carriers"><FormattedMessage {...messages.carriers} /></Link>
                  <Link className="column-item" to="/brokers"><FormattedMessage {...messages.brokers} /></Link>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Header className="column-header"><FormattedMessage {...messages.company} /></Header>
                  <Link className="column-item" to="/about"><FormattedMessage {...messages.about} /></Link>
                </Grid.Column>
                <Grid.Column width={4}>
                  <Header className="column-header"><FormattedMessage {...messages.contactUs} /></Header>
                  <FormattedMessage {...messages.contactUsText} /> <Link to="/contact"><FormattedMessage {...messages.contactUs} /></Link>
                </Grid.Column>
                <Grid.Column width={16} textAlign="center" className="footer-copy">
                  <FormattedMessage {...messages.licenseMessage} /> <FormattedMessage {...messages.privacyAndTermsOur} /> <Link to="/privacy"><FormattedMessage {...messages.privacyAndTerms} /></Link>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
      </div>
    );
  }
}

export default injectIntl(Footer);
