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
import CardCreator from './components/CardCreator';
import Generator from './components/Generator';

import DefaultLayout from './layouts/MainLayout';

import { dummyCards } from './dummyData';

dummyCards.forEach((d, i) => {
  d.id = i;
  return d;
});
// import NotFound from './containers/NotFound/NotFound';

const defaultLocation = {
  latitude: 50.85146,
  longitude: 4.315483
};
// debug('lego:routes');
const defaultState = {
  MapView: {
    headerPad: 60, // TODO: remove
    cards: dummyCards,
    mapZoom: 20,
    centerLocation: defaultLocation,
    userLocation: defaultLocation,
    selectedId: null,
    height: 100,
    width: 100,
    defaultHeight: 100,
    gridWidth: 100,
    maxHeight: 100,
    minHeight: 100,
    mapHeight: 100,
    gridHeight: 100,
    cardChallengeOpen: false
  },
  CardCreator: {
    headerPad: 60, // TODO: remove
    cards: dummyCards,
    width: 100,
    height: 100,
    mapViewport: { ...defaultLocation, zoom: 10 },
    selectedCardId: null,
    tempCards: []
  }
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
            </Provider>
          </DefaultLayout>}
      />
      <Route
        exact
        path="/card_creator"
        render={() =>
          <DefaultLayout>
            <Provider store={store}>
              <CardCreator />
            </Provider>
          </DefaultLayout>}
      />
      <Route
        exact
        path="/generator"
        render={() =>
          <DefaultLayout>
            <Provider store={store}>
              <Generator />
            </Provider>
          </DefaultLayout>}
      />
    </Switch>
  </HashRouter>;

export default Routes;
