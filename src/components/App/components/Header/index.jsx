import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { RaisedButton } from 'material-ui';

import styles from './styles.css';
import UserPanel from '../UserPanel';

class Header extends Component {
  static propTypes = {
    appStore: PropTypes.object.isRequired,
    authStore: PropTypes.object.isRequired,
    navItems: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
      })),
    })).isRequired,
  };

  render() {
    const { appStore, authStore, navItems } = this.props;

    return (
      <header className={styles.main}>
        <div className={styles.left}>
          <img alt="Junday" className={styles.logo} src="https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/junday.svg?alt=media&token=4ce84bb1-78c7-4fa9-8b38-ac8144090d8a" />

          <nav className={styles.nav}>
            <ul>
              {navItems.map(navItem =>
                <li key={navItem.id}>
                  <Link
                    activeClassName={styles.active}
                    onlyActiveOnIndex={navItem.to === '/'}
                    to={navItem.to}
                  >
                    {navItem.name}
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className={styles.right}>
          <div className={styles.userPanel}>
            <UserPanel authStore={authStore} />
          </div>

          <RaisedButton className={styles.button} onClick={() => appStore.toggleGuestDialog(true)}>
            Add Guest
          </RaisedButton>
        </div>
      </header>
    );
  }
}

export default Header;
