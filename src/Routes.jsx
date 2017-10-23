import React from 'react';

import {
  // Router,
  Route,
  // hashHistory,
  // IndexRoute,
  // Link,
  HashRouter,
  Switch
} from 'react-router-dom';
// import debug from 'debug';

import MapViewStore from './containers/MapViewStore';
import MapView from './components/MapView';
// TODO: learn redux
// import JournalStore from './ChallengeCRUD';

// TODO: rename please
import Hassan from './components/Hassan';

import DefaultLayout from './layouts/MainLayout';
// import NotFound from './containers/NotFound/NotFound';

// debug('lego:routes');

const Routes = () =>
  <HashRouter>
    <Switch>
      <Route
        exact
        path="/"
        render={() =>
          <DefaultLayout>
            <MapView />
          </DefaultLayout>}
      />
      <Route exact path="/journal" render={() => <DefaultLayout />} />
      <Route
        exact
        path="/hassan"
        render={() =>
          <DefaultLayout>
            <Hassan />
          </DefaultLayout>}
      />
    </Switch>
  </HashRouter>;

export default Routes;
