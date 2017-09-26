import 'font-awesome/css/font-awesome.css';
import 'w3-css/w3.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Routes from './Routes';


import App from "./App";


const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  );
};

render(Routes);
if (module.hot) {
  module.hot.accept('./Routes', () => {
    render(Routes);
  });
}
