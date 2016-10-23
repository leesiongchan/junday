import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { browserHistory } from 'react-router';

import Router from 'app/fixes/react-router-fix';
import routes from 'app/routes';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const rootEl = document.getElementById('root');

ReactDOM.render(
  <AppContainer>
    <MuiThemeProvider>
      <Router history={browserHistory} routes={routes} />
    </MuiThemeProvider>
  </AppContainer>,
  rootEl
);

if (module.hot) {
  module.hot.accept('./routes', () => {
    const nextRoutes = require('./routes').default;

    ReactDOM.render(
      <AppContainer>
        <MuiThemeProvider>
          <Router history={browserHistory} routes={nextRoutes} />
        </MuiThemeProvider>
      </AppContainer>,
      rootEl
    );
  });
}
