import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import styles from './styles.css';

@observer
class UserPanel extends Component {
  static propTypes = {
    authStore: PropTypes.object.isRequired,
  };

  @computed
  get user() {
    return this.props.authStore.user;
  }

  handleLogoutClick() {
    this.props.authStore.signOut();

    browserHistory.replace('/');
  }
  handleLogoutClick = ::this.handleLogoutClick;

  render() {
    if (!this.user) {
      return null;
    }

    return (
      <div className={styles.main}>
        <span className={styles.username}>
          {this.user.email}
        </span>

        <span className={styles.logout} onClick={this.handleLogoutClick}>
          <i className="material-icons">power_settings_new</i>
        </span>
      </div>
    );
  }
}

export default UserPanel;
