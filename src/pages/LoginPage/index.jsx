import _ from 'lodash';
import React, { Component, PropTypes } from 'react';

import LoginForm from 'app/components/Auth/LoginForm';
import styles from './styles.css';

const BACKGROUND_PHOTOS = [
  'https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/images%2F13403297_10155005216184768_8711558632713375606_o.jpg?alt=media&token=9ee57644-5ee3-47de-bcda-8b84b0e88221',
  'https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/images%2F13416738_10155005145904768_931751250445213136_o.jpg?alt=media&token=ae1b417c-d24d-4168-a19e-39d75c3a764d',
  'https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/images%2F13422359_10155005216064768_899742461254954015_o.jpg?alt=media&token=d16505fe-debd-4631-b694-303a62c3026d',
  'https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/images%2F13458705_10155005130229768_1995584470615303454_o.jpg?alt=media&token=954e66a9-c656-4577-9aa4-10c294b88fbe',
];

class LoginPage extends Component {
  static propTypes = {
    authStore: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  render() {
    const { authStore, location } = this.props;

    return (
      <div className={styles.main} style={{ backgroundImage: `url(${_.sample(BACKGROUND_PHOTOS)})` }}>
        <div className="container">
          <div className={styles.panel}>
            <header className={styles.header}>
              <img alt="Junday" className={styles.logo} src="https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/junday.svg?alt=media&token=4ce84bb1-78c7-4fa9-8b38-ac8144090d8a" />
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
