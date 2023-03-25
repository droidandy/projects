import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Message, Grid } from 'semantic-ui-react';
import { createAndShow, LOCK_CONTAINER_ID } from './lib';
import { LoginWrapper } from './LoginWrapper';
// import styles from './styles.css';

export class LoginPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.shape({
        nextPathname: PropTypes.string.isRequired,
      }),
    }).isRequired,
    expired: PropTypes.bool,
    CARRIER: PropTypes.string,
    secrets: PropTypes.object,
  };

  componentDidMount() {
    let nextPathname = this.props.location.state && this.props.location.state.nextPathname;
    if (!nextPathname || nextPathname === '/' || nextPathname === '//' || nextPathname === '/login' || nextPathname === '/profile') nextPathname = '/clients';
    createAndShow(nextPathname, this.props.CARRIER, this.props.secrets);
  }

  render() {
    return (
      <LoginWrapper className="loginWrapper">
        <Grid>
          <Grid.Row centered>
            <Grid.Column mobile={16} tablet={10} computer={6} largeScreen={6}>
              <Message warning hidden={!this.props.expired}>
                <Message.Header>Your session has expired. Please log in again.</Message.Header>
              </Message>
              <div id={LOCK_CONTAINER_ID} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </LoginWrapper>
    );
  }
}

function mapStateToProps(state) {
  const auth = state.get('profile');
  return {
    expired: auth.get('expired'),
  };
}


function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
