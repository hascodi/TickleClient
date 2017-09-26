import React from 'react';
import {
  Router,
  Route,
  hashHistory,
  IndexRoute,
  Link,
  HashRouter,
  Switch
} from 'react-router-dom';
// import debug from 'debug';

import MapView from './components/MapView';
import JournalStore from './ChallengeCRUD';

import DefaultLayout from './layouts/MainLayout';
// import NotFound from './containers/NotFound/NotFound';

// debug('lego:routes');

const Routes = () =>
  (<HashRouter>
    <Switch>
      <Route
        exact
        path="/"
        render={() =>
          (<DefaultLayout>
            <MapView />
          </DefaultLayout>)}
      />
      <Route
        exact
        path="/journal"
        render={() =>
          (<DefaultLayout>
            <JournalStore />
          </DefaultLayout>)}
      />
    </Switch>
  </HashRouter>);

export default Routes;
