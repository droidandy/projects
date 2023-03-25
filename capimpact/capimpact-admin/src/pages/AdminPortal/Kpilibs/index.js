import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';

import { KpilibsTable } from 'components/Kpilibs';

const Kpilibs = () => {
  let match = useRouteMatch();

  return (
    <div className="d-flex flex-column h-100">
      <Route path={`${match.path}`}>
        <KpilibsTable />
      </Route>
    </div>
  );
};

export default Kpilibs;
