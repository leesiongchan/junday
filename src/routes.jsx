import React from 'react';
import { IndexRedirect, Route } from 'react-router';

import App from 'app/components/App';
import AppStore from 'app/stores/AppStore';
import AuthStore from 'app/stores/AuthStore';
import CheckInPage from 'app/pages/CheckInPage';
import GuestIndexPage from 'app/pages/GuestIndexPage';
import GuestStore from 'app/stores/GuestStore';
import LoginPage from 'app/pages/LoginPage';
import Logout from 'app/components/Auth/Logout';
import NotFoundPage from 'app/pages/NotFoundPage';
import NotificationStore from 'app/stores/NotificationStore';
import ScanPage from 'app/pages/ScanPage';
import SettingsPage from 'app/pages/SettingsPage';
import SettingsStore from 'app/stores/SettingsStore';
import TableStore from 'app/stores/TableStore';
import UserIndexPage from 'app/pages/UserIndexPage';
import UserStore from 'app/stores/UserStore';

const appStore = new AppStore();
const authStore = new AuthStore();
const guestStore = new GuestStore(authStore);
const notificationStore = new NotificationStore(authStore);
const tableStore = new TableStore(authStore, guestStore);
const settingsStore = new SettingsStore(authStore, tableStore);
const userStore = new UserStore(authStore);

const Wrapper = ({ children }) => React.cloneElement(children, {
  appStore,
  authStore,
  guestStore,
  notificationStore,
  settingsStore,
  tableStore,
  userStore,
});

const routes = (
  <Route component={Wrapper}>
    <Route component={App} name="Home" path="/">
      <IndexRedirect to="check-in" />

      <Route path="check-in" component={CheckInPage} name="Check In" />
      <Route path="guests" component={GuestIndexPage} name="Guests" />
      <Route path="scan" component={ScanPage} name="Scan" />
      <Route path="settings" component={SettingsPage} name="Settings" />
      <Route path="users" component={UserIndexPage} name="Users" />
    </Route>

    <Route component={LoginPage} path="/login" />
    <Route component={Logout} path="/logout" />

    <Route component={NotFoundPage} path="*" />
  </Route>
);

export default routes;
