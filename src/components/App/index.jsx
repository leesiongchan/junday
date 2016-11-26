import Breadcrumbs from 'react-breadcrumbs';
import DevTools from 'mobx-react-devtools';
import React, { Component, PropTypes } from 'react';
import shortid from 'shortid';
import { autorun, computed } from 'mobx';
import { browserHistory } from 'react-router';
import { observer } from 'mobx-react';
import { Snackbar } from 'material-ui';

import config from 'config';
import GuestFormDialog from 'app/dialogs/GuestFormDialog';
import Header from './components/Header';
import MobxForm from 'app/libs/mobx-react-form';
import SignUpFormDialog from 'app/dialogs/SignUpFormDialog';
import styles from './styles.css';
import { formOptions as guestFormOptions } from 'app/forms/GuestForm';
import { formOptions as userFormOptions } from 'app/forms/UserForm';
import { ROLE, ROLE_RANK } from 'app/constants/user';

const NAV_ITEMS = [{
  id: shortid(),
  name: 'Guests',
  to: '/guests',
}, {
  id: shortid(),
  name: 'Users',
  role: ROLE.ADMIN,
  to: '/users',
}, {
  id: shortid(),
  name: 'Settings',
  role: ROLE.ADMIN,
  to: '/settings',
}, {
  id: shortid(),
  name: 'Test Scan',
  to: '/scan',
}];

function getRoleRank(role) {
  switch (role) {
    case ROLE.USER:
      return ROLE_RANK.USER;

    case ROLE.ADMIN:
      return ROLE_RANK.ADMIN;

    default:
      return 0;
  }
}

@observer
class App extends Component {
  static propTypes = {
    appStore: PropTypes.object,
    authStore: PropTypes.object,
    children: PropTypes.node.isRequired,
    guestStore: PropTypes.object,
    notificationStore: PropTypes.object,
    params: PropTypes.object.isRequired,
    routes: PropTypes.array.isRequired,
    settingsStore: PropTypes.object,
    tableStore: PropTypes.object,
    userStore: PropTypes.object,
  };

  componentDidMount() {
    this.authHandler = autorun(() => {
      if (!this.props.authStore.isLoading && !this.props.authStore.user) {
        browserHistory.replace('/login');
      }
    });

    this.guestHandler = autorun(() => {
      this.guestForm.update(this.props.appStore.guest);
    });
  }

  componentWillUnmount() {
    if (this.authHandler) {
      this.authHandler();
      this.authHandler = null;
    }

    if (this.guestHandler) {
      this.guestHandler();
      this.guestHandler = null;
    }

    this.guestForm.reset();
    this.signUpForm.reset();
  }

  guestForm = new MobxForm(guestFormOptions);
  signUpForm = new MobxForm(userFormOptions);

  @computed
  get navItems() {
    if (!this.user) {
      return [];
    }

    return NAV_ITEMS.filter(navItem => getRoleRank(this.user.role) >= getRoleRank(navItem.role));
  }

  @computed
  get numTables() {
    return parseInt(this.props.settingsStore.numTables, 10);
  }

  @computed
  get seatingCapacity() {
    return parseInt(this.props.settingsStore.seatingCapacity, 10);
  }

  @computed
  get tables() {
    return this.props.tableStore.items.peek();
  }

  @computed
  get user() {
    if (!this.props.authStore.user) {
      return null;
    }

    return this.props.userStore.findBy(u => u.email === this.props.authStore.user.email);
  }

  handleGuestFormDialogCloseClick() {
    this.props.appStore.toggleGuestFormDialog(false);
    this.guestForm.clear();
  }
  handleGuestFormDialogCloseClick = ::this.handleGuestFormDialogCloseClick;

  async handleGuestFormDialogDeleteClick() {
    try {
      const guest = this.props.appStore.guest;

      await this.props.guestStore.remove(guest.id);

      this.props.notificationStore.save({
        message: `${this.props.authStore.user.email} has removed a guest (${guest.name}) information.`,
        open: true,
      });

      this.props.appStore.toggleGuestFormDialog(false);
      this.guestForm.reset();
    } catch (err) {
      this.guestForm.clear();
      this.guestForm.invalidate(err.message);
    }
  }
  handleGuestFormDialogDeleteClick = ::this.handleGuestFormDialogDeleteClick;

  async handleGuestFormDialogSubmit(formData) {
    const isNew = !this.props.appStore.guest;

    try {
      if (this.props.appStore.guest) {
        await this.props.guestStore.save(this.props.appStore.guest.id, formData);
      } else {
        await this.props.guestStore.add(formData);
      }

      this.props.notificationStore.save({
        message: `${this.props.authStore.user.email} has ${isNew ? 'added a new guest' : 'updated a guest'} (${formData.name}) information.`,
        open: true,
      });

      this.props.appStore.toggleGuestFormDialog(false);
      this.guestForm.reset();
    } catch (err) {
      this.guestForm.clear();
      this.guestForm.invalidate(err.message);
    }
  }
  handleGuestFormDialogSubmit = ::this.handleGuestFormDialogSubmit;

  handleSignUpFormDialogCloseClick() {
    this.props.appStore.toggleSignUpFormDialog(false);
    this.signUpForm.clear();
  }
  handleSignUpFormDialogCloseClick = ::this.handleSignUpFormDialogCloseClick;

  async handleSignUpFormDialogSubmit(formData) {
    try {
      await this.props.authStore.create(formData);
      await this.props.userStore.add({ email: formData.email, role: ROLE.USER });

      this.props.notificationStore.save({
        message: `${this.props.authStore.user.email} has created a user (${formData.email})`,
        open: true,
      });

      this.props.appStore.toggleSignUpFormDialog(false);
      this.signUpForm.reset();
    } catch (err) {
      this.signUpForm.clear();
      this.signUpForm.invalidate(err.message);
    }
  }
  handleSignUpFormDialogSubmit = ::this.handleSignUpFormDialogSubmit;

  handleSnackbarToggle(open) {
    this.props.notificationStore.save({
      open: typeof open === 'boolean' ? open : !this.props.notificationStore.open,
    });
  }
  handleSnackbarToggle = ::this.handleSnackbarToggle;

  render() {
    const { appStore, authStore, children, notificationStore, params, routes, ...props } = this.props;

    if (!this.props.authStore.user) {
      return null;
    }

    return (
      <div className={styles.main}>
        <Header
          appStore={appStore}
          authStore={authStore}
          className={styles.header}
          navItems={this.navItems}
        />

        <div className={styles.contentWrapper}>
          <main className={styles.content}>
            <header className={styles.contentHeader}>
              <div className={styles.container}>
                <Breadcrumbs
                  itemClass={styles.breadcrumbsItem}
                  params={params}
                  routes={routes}
                  wrapperClass={styles.breadcrumbsWrapper}
                />
              </div>
            </header>

            <div className={styles.innerContent}>
              {React.cloneElement(children, { appStore, authStore, notificationStore, params, routes, ...props })}
            </div>
          </main>
        </div>

        <GuestFormDialog
          fields={this.guestForm}
          numTables={this.numTables}
          onClose={this.handleGuestFormDialogCloseClick}
          onDelete={this.handleGuestFormDialogDeleteClick}
          onSubmit={this.handleGuestFormDialogSubmit}
          open={appStore.isGuestFormDialogOpen}
          seatingCapacity={this.seatingCapacity}
          tables={this.tables}
        />

        <SignUpFormDialog
          fields={this.signUpForm}
          onClose={this.handleSignUpFormDialogCloseClick}
          onSubmit={this.handleSignUpFormDialogSubmit}
          open={appStore.isSignUpFormDialogOpen}
        />

        <Snackbar
          autoHideDuration={4000}
          message={notificationStore.message}
          open={notificationStore.open}
          onRequestClose={() => this.handleSnackbarToggle(false)}
        />

        {config.NODE_ENV === 'development' &&
          <DevTools />
        }
      </div>
    );
  }
}

export default App;
