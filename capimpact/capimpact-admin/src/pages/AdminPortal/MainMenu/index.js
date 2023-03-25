import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Paper from 'components/Paper';

import classes from './style.module.scss';

const MainMenu = () => (
  <div className="d-flex flex-column h-100">
    <div className={classNames(classes.mainMenu)}>
      <Paper>
        <h2 className="my-2">Main Menu</h2>
        <div className="row">
          <div className="col-4">
            <h5>Industry</h5>
            <nav className="nav flex-column">
              <Link className="nav-link" to={`/processes/1`}>
                Processes
              </Link>
              <Link className="nav-link" to={`/capabilities/12`}>
                Captrees
              </Link>
              <Link className="nav-link" to={`/valuedrivers/12`}>
                Value Drivers
              </Link>
              <Link className="nav-link" to={`/startups/1`}>
                Start Ups
              </Link>
            </nav>
          </div>
          <div className="col-4">
            <h5>Companies Admin</h5>
            <nav className="nav flex-column">
              <Link className="nav-link" to={`/companies`}>
                Companies
              </Link>
            </nav>
          </div>
          <div className="col-4">
            <h5>Globals</h5>
            <nav className="nav flex-column">
              <Link className="nav-link" to={`/kpilibs`}>
                KPI Library
              </Link>
              <Link className="nav-link" to={`/default-filters`}>
                Default Filters
              </Link>
            </nav>
          </div>
        </div>
      </Paper>
    </div>
  </div>
);

export default MainMenu;
