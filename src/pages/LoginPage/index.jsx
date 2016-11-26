import _ from 'lodash';
import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { action, observable, when } from 'mobx';
import { browserHistory } from 'react-router';
import { observer, propTypes as MobxPropTypes } from 'mobx-react';
import { RaisedButton } from 'material-ui';

import MobxForm from 'app/libs/mobx-react-form';
import styles from './styles.css';
import UserForm, { formOptions } from 'app/forms/UserForm';

const BACKGROUND_PHOTOS = [
  'https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/images%2F13403297_10155005216184768_8711558632713375606_o.jpg?alt=media&token=9ee57644-5ee3-47de-bcda-8b84b0e88221',
  'https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/images%2F13416738_10155005145904768_931751250445213136_o.jpg?alt=media&token=ae1b417c-d24d-4168-a19e-39d75c3a764d',
  'https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/images%2F13422359_10155005216064768_899742461254954015_o.jpg?alt=media&token=d16505fe-debd-4631-b694-303a62c3026d',
  'https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/images%2F13458705_10155005130229768_1995584470615303454_o.jpg?alt=media&token=954e66a9-c656-4577-9aa4-10c294b88fbe',
  'https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/images%2F13442599_10155005216529768_2266593902334588957_o.jpg?alt=media&token=5892bdc9-a643-4bcb-a66c-e7ab08c9e1b9',
  'https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/images%2F14876165_10208972015631437_952823969_o.jpg?alt=media&token=5d39b853-ede1-48f9-9cc2-92b0a9a68315',
];

@observer
class LoginPage extends Component {
  static propTypes = {
    authStore: PropTypes.object,
    location: PropTypes.object.isRequired,
  };

  state = {
    backgroundImage: _.sample(BACKGROUND_PHOTOS),
  };

  @action
  setSubmitting(submitting) {
    this.submitting = submitting;
  }

  form = new MobxForm(formOptions);

  @observable submitting = false;

  handleSubmit(ev) {
    this.form.onSubmit(ev, {
      onError: (form) => {
        const error = _.filter(form.errors(), e => !!e)[0];

        form.invalidate(error);
      },
      onSuccess: async (form) => {
        this.setSubmitting(true);

        try {
          await this.props.authStore.signIn(form.values());

          form.reset();

          when(
            () => this.props.authStore.user,
            () => {
              // Redirects
              if (this.props.location.state && this.props.location.state.redirect) {
                browserHistory.push(this.props.location.state.redirect);
              } else {
                browserHistory.push('/');
              }
            },
          );
        } catch (err) {
          form.clear();
          form.invalidate(err.message);
        } finally {
          this.setSubmitting(false);
        }
      },
    });
  }
  handleSubmit = ::this.handleSubmit;

  render() {
    const { backgroundImage } = this.state;
    const { error, isValid } = this.form;

    return (
      <div className={styles.main} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="container">
          <div className={styles.panel}>
            <header className={styles.header}>
              <picture className={styles.logo}>
                <source type="image/svg+xml" srcSet="https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/junday.svg?alt=media&token=4ce84bb1-78c7-4fa9-8b38-ac8144090d8a" />
                <img alt="Junday" src="https://firebasestorage.googleapis.com/v0/b/junday-7dff3.appspot.com/o/junday.png?alt=media&token=5b7b1ac1-7867-49ed-95b8-410a5a744db3" />
              </picture>
            </header>

            <div className={styles.content}>
              <form className={styles.form} onSubmit={this.handleSubmit}>
                <div className={styles.content}>
                  {error &&
                    <p className={cx(styles.message, styles.error)}>{error}</p>
                  }

                  <UserForm fields={this.form} />
                </div>

                <footer className={styles.footer}>
                  <RaisedButton
                    className={styles.submit}
                    disabled={!isValid || this.submitting}
                    secondary
                    style={{ color: '#ffffff' }}
                    type="submit"
                  >
                    {this.submitting ? 'Logging in...' : 'Log in'}
                  </RaisedButton>
                </footer>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
