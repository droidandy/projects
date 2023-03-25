import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { Grid } from 'semantic-ui-react';
import messages from './messages';

function Footer() {
  return (
    <footer className="app-footer-wrap">
      <Grid centered stackable textAlign="center" className="app-footer">
        <Grid.Row>
          <Grid.Column width={4}>
            <FormattedMessage {...messages.licenseMessage} />
          </Grid.Column>
          <Grid.Column width={3}>
            Our <Link to="/privacy">Privacy</Link> and <Link to="/terms">Terms</Link>
          </Grid.Column>
          <Grid.Column width={2}>
            <Link to="/contact">
              <FormattedMessage {...messages.contactUs} />
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </footer>
  );
}

export default Footer;
