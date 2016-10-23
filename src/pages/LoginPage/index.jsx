import React, { Component, PropTypes } from 'react';

import LoginForm from 'app/components/Auth/LoginForm';
import styles from './styles.css';

class LoginPage extends Component {
  static propTypes = {
    authStore: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  render() {
    const { authStore, location } = this.props;

    return (
      <div className={styles.main}>
        <div className="container">
          <div className={styles.panel}>
            <header className={styles.header}>
              <h1 className={styles.title}>
                Log in to Tripviss Admin
              </h1>
            </header>

            <div className={styles.content}>
              <LoginForm authStore={authStore} location={location} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
