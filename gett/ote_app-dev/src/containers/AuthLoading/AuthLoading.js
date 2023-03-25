import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getCurrentUser } from 'actions/session';

class AuthLoading extends PureComponent {
  static propTypes = {
    getCurrentUser: PropTypes.func,
    navigation: PropTypes.object,
    session: PropTypes.object
  };

  componentDidMount() {
    const { session: { token }, getCurrentUser, navigation } = this.props;

    if (token) {
      getCurrentUser()
        .then(() => navigation.navigate('TransitionLoading'))
        .catch(() => navigation.navigate('Login'));
    } else {
      navigation.navigate('Login');
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = ({ session }) => ({
  session
});

const mapDispatchToProps = ({
  getCurrentUser
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoading);
