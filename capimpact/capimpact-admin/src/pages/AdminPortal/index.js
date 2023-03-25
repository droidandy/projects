import React from 'react';
import { Switch, Route } from 'react-router-dom';

import MainMenu from './MainMenu';
//import Industries from './Industries';
import OriginalProcesses from './OriginalProcesses';
import Processes from './Processes';
import Capabilities from './Capabilities';
import ValueDrivers from './ValueDrivers';
import StartUps from './StartUps';
import Companies from './Companies';
import Kpilibs from './Kpilibs';

export default () => {
  return (
    <Switch>
      <Route path="/processes" component={Processes} />
      <Route path="/original-processes" component={OriginalProcesses} />
      <Route path="/capabilities" component={Capabilities} />
      <Route path="/valuedrivers" component={ValueDrivers} />
      <Route path="/startups" component={StartUps} />
      <Route path="/companies" component={Companies} />
      <Route path="/kpilibs" component={Kpilibs} />
      <Route path="/" component={MainMenu} />
    </Switch>
  );
};

/*
      <Route path="/industries/:industryId">
        <Industries />
      </Route>
*/
