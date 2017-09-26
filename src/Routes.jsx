import React from 'react';
import { Router, Route, hashHistory, IndexRoute, Link, HashRouter, Switch} from 'react-router-dom';
// import debug from 'debug';

import App from './App';
import Challenge from './components/cards/Card';
import JournalStore from './ChallengeCRUD';
// import NotFound from './containers/NotFound/NotFound';

// debug('lego:routes');

const Routes = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/journal" component={JournalStore} />
      <Route exact path="/challenge" component={Challenge} />
    </Switch>
  </HashRouter>
);

export default Routes;
