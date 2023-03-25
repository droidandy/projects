import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Segment, Dimmer, Loader } from 'semantic-ui-react';
import Helmet from 'react-helmet';

class EmailVerificationLanding extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    gaForm: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    verifyAgentEmail: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.state = {};
  }

  componentDidMount() {
    const { verifyAgentEmail } = this.props;
    const verificationCode = this.getUrlVars().verificationCode;
    if (verificationCode && verificationCode.length) {
      verifyAgentEmail(verificationCode);
    }
  }

  getUrlVars() {
    const vars = [];
    let hash;
    const hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (let i = 0; i < hashes.length; i += 1) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  render() {
    const { gaForm, loading } = this.props;
    return (
      <div>
        <Helmet
          title="GA"
          meta={[
            { name: 'description', content: 'Description of account' },
          ]}
        />
        <Grid stackable container className="emailVerification section-wrap">
          <Grid.Column width={16} className="">
            <Grid stackable as={Segment} className="gridSegment">
              { !loading &&
              <Grid.Row className="gaCenteredRow">
                { gaForm.agentVerified &&
                <Grid.Column width={16}>
                  <Header as="h3" className="">Thank you for verifying your email.</Header>
                  <p>We will notify you when your account requests has been approved.</p>
                </Grid.Column> ||
                <Grid.Column width={16}>
                  <Header as="h3" className="">Sorry! We could not verify your email address, please try again.</Header>
                  <p>If you continue to receive this error, please contact our support team.</p>
                </Grid.Column>
                }
              </Grid.Row>
              }
              { loading &&
              <Grid.Row className="gaCenteredRow">
                <Dimmer active={loading} inverted>
                  <Loader indeterminate size="big">Email verification</Loader>
                </Dimmer>
              </Grid.Row>
              }
            </Grid>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default EmailVerificationLanding;
