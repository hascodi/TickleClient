import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import actions from './actions';

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

import reducers from './reducers';

import MapView from './components/MapView';
import Hassan from './components/Hassan';

import DefaultLayout from './layouts/MainLayout';

import { dummyCards } from './dummyData';
// import NotFound from './containers/NotFound/NotFound';

// debug('lego:routes');
const defaultState = {
  headerPad: 60, // TODO: remove
  cards: dummyCards,
  mapZoom: 20,
  centerLocation: {
    latitude: 50.85146,
    longitude: 4.315483
  },
  userLocation: {
    latitude: 50.85146,
    longitude: 4.315483
  },
  selectedCard: null,
  height: 100,
  width: 100,
  defaultHeight: 100,
  gridWidth: 100,
  maxHeight: 100,
  minHeight: 100,
  mapHeight: 100,
  gridHeight: 100,
  cardChallengeOpen: false
};

const store = createStore(reducers, defaultState);

console.log('actions', actions);

// window.addEventListener('load', () => {
//   store.dispatch(
//     actions.screenResize({
//       width: window.innerWidth,
//       height: window.innerHeight
//     })
//   );
// });

const Routes = () =>
  <HashRouter>
    <Switch>
      <Route
        exact
        path="/"
        render={() =>
          <DefaultLayout>
            <Provider store={store}>
              <MapView />
            </Provider>;
          </DefaultLayout>}
      />
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
