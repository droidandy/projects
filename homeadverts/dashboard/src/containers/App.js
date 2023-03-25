import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { BarLoader } from 'react-spinners';
import { withStyles, CssBaseline } from '@material-ui/core';
import { authorizeUser } from 'service/user/user';
import { initializeData } from 'service/initializer';
import { onBoardingShow } from 'service/notification';
import { drawerHideAction } from 'action/nav';
import NavDrawer from 'components/Nav/NavDrawer';
import { Notification, Messenger, Editor } from 'containers';

const styles = () => ({
  loading: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    zIndex: 123,
    background: '#fff',
    textAlign: 'center',
  },
  spinner: {
    top: '50%',
    left: '50%',
    position: 'absolute',
    marginLeft: '-50px',
    marginTop: '-75px',
  },
});

class App extends Component {
  static propTypes = {
    me: PropTypes.object.isRequired,
    nav: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    notification: PropTypes.object.isRequired,
    initializeData: PropTypes.func.isRequired,
    onBoardingShow: PropTypes.func.isRequired,
    authorizeUser: PropTypes.func.isRequired,
    drawerHideAction: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  componentDidMount() {
    const { initializeData, onBoardingShow, authorizeUser } = this.props;
    onBoardingShow();
    authorizeUser();
    initializeData();
  }

  render() {
    const { me, nav, classes, notification, drawerHideAction } = this.props;
    const isLoading = me.id === undefined;
    const isOpen = nav?.open === 'nav';

    return (
      <Fragment>
        <CssBaseline />
        <Router>
          <div>
            {isLoading && (
              <div id="loading" className={classes.loading}>
                <div className={classes.spinner}>
                  <img width={100} height={100} alt="Application loading ..." src="/logo.png" />
                  <BarLoader sizeUnit="px" size={50} height={3} color="#212121" loading={isLoading} />
                </div>
              </div>
            )}

            <Route exact path={['/', '/room/', '/room/:id']} component={Messenger} />
            <Route path="/edit/:id" component={Editor} />
          </div>
        </Router>
        <NavDrawer data={me} onClose={drawerHideAction} open={isOpen} />
        <Notification data={notification} />
      </Fragment>
    );
  }
}

Route.propTypes = {
  computedMatch: PropTypes.object,
  path: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  sensitive: PropTypes.bool,
  component: PropTypes.func,
  render: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  location: PropTypes.object,
};

const mapStateToProps = ({ user: { me }, nav, notification }) => ({ me, nav, notification });

const mapDispatchToProps = { initializeData, onBoardingShow, authorizeUser, drawerHideAction };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));

