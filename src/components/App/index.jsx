import Breadcrumbs from 'react-breadcrumbs';
import DevTools from 'mobx-react-devtools';
import React, { Component, PropTypes } from 'react';
import shortid from 'shortid';

import config from 'config';
import Header from './components/Header';
import styles from './styles.css';

const NAV_ITEMS = [{
  id: shortid(),
  name: 'Guests',
  to: '/guests',
}, {
  id: shortid(),
  name: 'Settings',
  to: '/settings',
}];

class App extends Component {
  static propTypes = {
    authStore: PropTypes.object,
    children: PropTypes.node.isRequired,
    params: PropTypes.object.isRequired,
    routes: PropTypes.array.isRequired,
  };

  render() {
    const { authStore, children, params, routes, ...props } = this.props;

    return (
      <div className={styles.main}>
        <Header authStore={authStore} className={styles.header} navItems={NAV_ITEMS} />

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
              {React.cloneElement(children, { authStore, params, routes, ...props })}
            </div>
          </main>
        </div>

        {config.NODE_ENV === 'development' &&
          <DevTools />
        }
      </div>
    );
  }
}

export default App;
