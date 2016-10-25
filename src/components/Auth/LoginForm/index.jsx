import _ from 'lodash';
import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import { action, observable, when } from 'mobx';
import { browserHistory } from 'react-router';
import { observer, propTypes as MobxPropTypes } from 'mobx-react';
import { RaisedButton, TextField } from 'material-ui';

import MobxField from 'app/controls/MobxField';
import MobxForm from 'app/libs/mobx-react-form';
import styles from './styles.css';

const formFields = [
  'email',
  'password',
];

const labels = {
  email: 'Email Address',
  password: 'Password',
};

const rules = {
  email: 'required|email',
  password: 'required|between:8,30',
};

export const formOptions = { fields: formFields, labels, rules };

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
              if (this.props.autoRedirect) {
                if (this.props.location.state && this.props.location.state.redirect) {
                  browserHistory.push(this.props.location.state.redirect);
                } else {
                  browserHistory.push('/');
                }
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
            <MobxField
              component={TextField}
              field={this.form.$('email')}
              floatingLabelFixed
              required
              type="email"
            />
          </div>

          <div className={styles.field}>
            <MobxField
              component={TextField}
              field={this.form.$('password')}
              floatingLabelFixed
              required
              type="password"
            />
          </div>
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
    );
  }
}

export default LoginForm;
