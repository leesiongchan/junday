import React from 'react';
import { Redirect, Route } from 'react-router';

import App from 'app/components/App';
import AppStore from 'app/stores/AppStore';
import GuestIndexPage from 'app/pages/GuestIndexPage';
import GuestStore from 'app/stores/GuestStore';
import LoginPage from 'app/pages/LoginPage';
import Logout from 'app/components/Auth/Logout';
import NotFoundPage from 'app/pages/NotFoundPage';
import SettingsPage from 'app/pages/SettingsPage';
import SettingsStore from 'app/stores/SettingsStore';
import TableStore from 'app/stores/TableStore';

const appStore = new AppStore();
const guestStore = new GuestStore();
const tableStore = new TableStore(guestStore);
const settingsStore = new SettingsStore(tableStore);

const Wrapper = ({ children }) => React.cloneElement(children, {
  appStore,
  guestStore,
  settingsStore,
  tableStore,
});

const routes = (
  <Route component={Wrapper}>
    <Redirect from="/" to="/guests" />

    <Route component={App} name="Home" path="/">
      <Route path="guests" component={GuestIndexPage} name="Guests" />
      <Route path="settings" component={SettingsPage} name="Settings" />
    </Route>

    <Route component={LoginPage} path="/login" />
    <Route component={Logout} path="/logout" />

    <Route component={NotFoundPage} path="*" />
  </Route>
);

export default routes;
