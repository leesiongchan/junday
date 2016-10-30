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
import styles from './styles.css';
import { formOptions as guestFormOptions } from 'app/forms/GuestForm';

const NAV_ITEMS = [{
  id: shortid(),
  name: 'Guests',
  to: '/guests',
}, {
  id: shortid(),
  name: 'Settings',
  to: '/settings',
}, {
  id: shortid(),
  name: 'Test Scan',
  to: '/scan',
}];

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
  }

  guestForm = new MobxForm(guestFormOptions);

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

  handleGuestFormDialogCloseClick() {
    this.props.appStore.toggleGuestDialog(false);
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
    } catch (err) {
      console.log('Error', err);
    }

    this.props.appStore.toggleGuestDialog(false);
    this.guestForm.reset();
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
    } catch (err) {
      console.log('Error', err);
    }

    this.props.appStore.toggleGuestDialog(false);
    this.guestForm.reset();
  }
  handleGuestFormDialogSubmit = ::this.handleGuestFormDialogSubmit;

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
        <Header appStore={appStore} authStore={authStore} className={styles.header} navItems={NAV_ITEMS} />

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
          open={appStore.isGuestDialogOpen}
          seatingCapacity={this.seatingCapacity}
          tables={this.tables}
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
