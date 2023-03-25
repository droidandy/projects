import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { ClientContextProvider } from 'react-fetching-library';
import PrivateRoute from 'components/PrivateRoute';

import { client } from 'api/client';

import TopNavbar from 'components/TopNavbar';
import Footer from 'components/Footer';

import LoginPage from 'pages/LoginPage';
import AdminPortal from 'pages/AdminPortal';

function App() {
  return (
    <ClientContextProvider client={client}>
      <Router>
        <div className="d-flex flex-column h-100 clearprism">
          <header>
            <TopNavbar />
          </header>
          <main role="main" className="flex-grow-1">
            <div className="container-fluid">
              <Switch>
                <Route path="/login">
                  <LoginPage />
                </Route>
                <PrivateRoute path="/">
                  <AdminPortal />
                </PrivateRoute>
              </Switch>
            </div>
          </main>
          <Footer />
        </div>
      </Router>
    </ClientContextProvider>
  );
}

export default App;
