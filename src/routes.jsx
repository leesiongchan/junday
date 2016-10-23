import firebaseInstance from 'firebase';
import React from 'react';
import { Redirect, Route } from 'react-router';

import App from 'app/components/App';
import AppStore from 'app/stores/AppStore';
import config from 'config';
import GuestIndexPage from 'app/pages/GuestIndexPage';
import GuestStore from 'app/stores/GuestStore';
import LoginPage from 'app/pages/LoginPage';
import Logout from 'app/components/Auth/Logout';
import NotFoundPage from 'app/pages/NotFoundPage';
import SettingsPage from 'app/pages/SettingsPage';
import SettingStore from 'app/stores/SettingStore';
import TableStore from 'app/stores/TableStore';

const firebase = firebaseInstance.initializeApp({
  apiKey: config.FIREBASE.API_KEY,
  authDomain: config.FIREBASE.AUTH_DOMAIN,
  databaseURL: config.FIREBASE.DATABASE_URL,
  storageBucket: config.FIREBASE.STORAGE_BUCKET,
});

const appStore = new AppStore();
const guestStore = new GuestStore(firebase);
const tableStore = new TableStore(firebase, guestStore);
const settingStore = new SettingStore(firebase, tableStore);

const Wrapper = ({ children }) => React.cloneElement(children, {
  appStore,
  guestStore,
  settingStore,
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
