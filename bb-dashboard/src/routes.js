import React from 'react';
import { Redirect, Route, Router } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import MarketCap from './dashboard/MarketCap/MarketCap';
import Profile from './Profile/Profile';
import Callback from './Callback/Callback';
import Auth from './Auth/Auth';
import history from './history';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}

function requireAuth() {
  if(!auth.isAuthenticated()){
    auth.login();
    return (<div />)
  } else {
    return (<Redirect to="/dashboard" />);
  }
}

export const makeMainRoutes = () => {
  return (
      <Router history={history} component={Dashboard}>
        <div>
          <Route exact path="/" render={requireAuth} />
          <Route path="/market-cap" render={(props) => (
              <MarketCap auth={auth} {...props} />
            )}/>
          <Route exact path="/dashboard" render={(props) => (
            !auth.isAuthenticated() ? (
                <Redirect to="/"/>
                ) : (
            <Dashboard auth={auth} {...props} />
                )
            )} />
          <Route path="/profile" render={(props) => (
            !auth.isAuthenticated() ? (
              <Redirect to="/"/>
            ) : (
              <Profile auth={auth} {...props} />
            )
          )} />
          <Route path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} /> 
          }}/>
        </div>
      </Router>
  );
}
