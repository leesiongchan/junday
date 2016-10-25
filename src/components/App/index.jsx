import Breadcrumbs from 'react-breadcrumbs';
import DevTools from 'mobx-react-devtools';
import React, { Component, PropTypes } from 'react';
import shortid from 'shortid';
import { autorun, computed } from 'mobx';
import { browserHistory } from 'react-router';
import { observer } from 'mobx-react';

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
}];

@observer
class App extends Component {
  static propTypes = {
    appStore: PropTypes.object,
    authStore: PropTypes.object,
    children: PropTypes.node.isRequired,
    guestStore: PropTypes.object,
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

  handleGuestFormDialogClose() {
    this.props.appStore.toggleGuestDialog(false);
    this.guestForm.clear();
  }
  handleGuestFormDialogClose = ::this.handleGuestFormDialogClose;

  async handleGuestFormDialogSubmit(formData) {
    try {
      if (this.props.appStore.guest) {
        await this.props.guestStore.save(this.props.appStore.guest.id, formData);
      } else {
        await this.props.guestStore.add(formData);
      }
    } catch (err) {
      console.log('Error', err);
    }

    this.guestForm.reset();

    this.props.appStore.toggleGuestDialog(false);
  }
  handleGuestFormDialogSubmit = ::this.handleGuestFormDialogSubmit;

  render() {
    const { appStore, authStore, children, params, routes, ...props } = this.props;

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
              {React.cloneElement(children, { appStore, authStore, params, routes, ...props })}
            </div>
          </main>
        </div>

        {config.NODE_ENV === 'development' &&
          <DevTools />
        }

        <GuestFormDialog
          fields={this.guestForm}
          numTables={this.numTables}
          onClose={this.handleGuestFormDialogClose}
          onSubmit={this.handleGuestFormDialogSubmit}
          open={appStore.isGuestDialogOpen}
          seatingCapacity={this.seatingCapacity}
          tables={this.tables}
        />
      </div>
    );
  }
}

export default App;
