import React from 'react';
import ReactDOM from 'react-dom';

import 'font-awesome/css/font-awesome.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import './bootstrap.scss';
import './index.scss';
import { AppContainer } from 'react-hot-loader';

import Routes from './Routes';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  );
};

console.log('module', module === true);

if (module.hot) {
  module.hot.accept('./Routes', () => {
    console.log('hot');
    render(Routes);
  });
}
render(Routes);
