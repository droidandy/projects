import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Message, Icon, Grid } from 'semantic-ui-react';
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
    permission: PropTypes.bool,
  };

  componentDidMount() {
    let nextPathname = this.props.location.state && this.props.location.state.nextPathname;
    if (!nextPathname || nextPathname === '/login') nextPathname = '/';
    createAndShow(nextPathname);
  }

  render() {
    return (
      <LoginWrapper>
        <Grid container>
          <Grid.Column width={16}>
            <Message warning hidden={!this.props.expired}>
              <Message.Header>
                <Icon name="warning circle" />Your session has expired. Please log in again.</Message.Header>
            </Message>
            <Message warning hidden={!this.props.permission}>
              <Message.Header>
                <Icon name="warning circle" />You do not have permission to log in.</Message.Header>
            </Message>
            <div id={LOCK_CONTAINER_ID} />
          </Grid.Column>
        </Grid>
      </LoginWrapper>
    );
  }
}

function mapStateToProps(state) {
  const auth = state.get('profile');
  return {
    expired: auth.get('expired'),
    permission: auth.get('permission'),
  };
}


function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
