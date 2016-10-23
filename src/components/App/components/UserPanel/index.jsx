import React, { Component, PropTypes } from 'react';
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

  render() {
    if (!this.user) {
      return null;
    }

    return (
      <div className={styles.main}>
        <span className={styles.username}>
          {this.user.email}
        </span>
      </div>
    );
  }
}

export default UserPanel;
