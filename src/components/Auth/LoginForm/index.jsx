import _ from 'lodash';
import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { action, observable, when } from 'mobx';
import { browserHistory } from 'react-router';
import { observer, propTypes as MobxPropTypes } from 'mobx-react';

import Button from 'app/controls/Button';
import MobxField from 'app/controls/MobxField';
import MobxForm from 'app/libs/mobx-react-form';
import styles from './styles.css';

const fields = {
  password: { label: 'Password', rules: 'required|between:8,20' },
  username: { label: 'Email Address', rules: 'required|email' },
};

@observer
class LoginForm extends Component {
  static propTypes = {
    authStore: PropTypes.object.isRequired,
    autoRedirect: PropTypes.bool,
    className: PropTypes.string,
    location: PropTypes.object.isRequired,
  };

  static defaultProps = {
    autoRedirect: true,
  };

  @action
  setSubmitting(submitting) {
    this.submitting = submitting;
  }

  form = new MobxForm({ fields });

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
          await this.props.authStore.authenticate(form.values());

          form.reset();

          when(
            () => this.props.authStore.user,
            () => {
              if (this.props.authStore.isAccessGranted) {
                // Redirects
                if (this.props.autoRedirect) {
                  if (this.props.location.state && this.props.location.state.redirect) {
                    browserHistory.push(this.props.location.state.redirect);
                  } else {
                    browserHistory.push('/');
                  }
                }
              } else {
                this.props.authStore.unauthorize();
                form.invalidate('You do not have sufficient permissions to access this site.');
              }
            }
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
    const { error, isValid } = this.form;
    const { className } = this.props;

    return (
      <form className={cx(styles.main, className)} onSubmit={this.handleSubmit}>
        <div className={styles.content}>
          {error &&
            <p className={cx(styles.message, styles.error)}>{error}</p>
          }

          <div className={styles.field}>
            <MobxField component="input" field={this.form.$('username')} required type="email" />
          </div>

          <div className={styles.field}>
            <MobxField component="input" field={this.form.$('password')} required type="password" />
          </div>
        </div>

        <footer className={styles.footer}>
          <Button
            className={styles.submit}
            disabled={!isValid || this.submitting}
            primary
            type="submit"
          >
            {this.submitting ? 'Logging in...' : 'Log in'}
          </Button>
        </footer>
      </form>
    );
  }
}

export default LoginForm;
