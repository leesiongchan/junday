import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { action, autorun, computed, observable } from 'mobx';
import { Card, RaisedButton } from 'material-ui';
import { observer } from 'mobx-react';

import MobxForm from 'app/libs/mobx-react-form';
import NotFoundPage from 'app/pages/NotFoundPage';
import SettingsForm, { formOptions as settingsFormOptions } from 'app/forms/SettingsForm';
import styles from './styles.css';
import { ROLE, ROLE_RANK } from 'app/constants/user';

function getRoleRank(role) {
  switch (role) {
    case ROLE.USER:
      return ROLE_RANK.USER;

    case ROLE.ADMIN:
      return ROLE_RANK.ADMIN;

    default:
      return 0;
  }
}

@observer
class SettingsPage extends Component {
  static propTypes = {
    authStore: PropTypes.object,
    notificationStore: PropTypes.object,
    settingsStore: PropTypes.object,
    userStore: PropTypes.object,
  };

  componentDidMount() {
    autorun(() => {
      this.settingsForm.update({
        numTables: this.props.settingsStore.numTables,
        seatingCapacity: this.props.settingsStore.seatingCapacity,
      });
    });
  }

  @action
  setSubmitting(submitting) {
    this.submitting = submitting;
  }

  settingsForm = new MobxForm(settingsFormOptions);

  @observable submitting = false;

  @computed
  get user() {
    if (!this.props.authStore.user) {
      return null;
    }

    return this.props.userStore.findBy(u => u.email === this.props.authStore.user.email);
  }

  @action
  handleSaveClick(ev) {
    this.settingsForm.onSubmit(ev, {
      onError: (form) => {
        const error = _.filter(form.errors(), e => !!e)[0];

        form.invalidate(error);
      },
      onSuccess: async (form) => {
        this.setSubmitting(true);

        try {
          await this.props.settingsStore.save(form.values());
          await this.props.settingsStore.rearrangeTables();

          this.props.notificationStore.save({
            message: `${this.props.authStore.user.email} has updated the settings.`,
            open: true,
          });
        } catch (err) {
          console.log('Error', err);
        }

        this.setSubmitting(false);
      },
    });
  }
  handleSaveClick = ::this.handleSaveClick;

  render() {
    if (!this.user) {
      return null;
    }

    if (getRoleRank(ROLE.ADMIN) > getRoleRank(this.user.role)) {
      return <NotFoundPage />;
    }

    return (
      <div className={styles.main}>
        <Card>
          <div className={styles.content}>
            {this.settingsForm.error &&
              <p className={styles.error}>
                {this.settingsForm.error}
              </p>
            }

            <SettingsForm fields={this.settingsForm} />

            <footer className={styles.footer}>
              <RaisedButton
                disabled={this.submitting || !this.settingsForm.isValid}
                label="Save"
                onClick={this.handleSaveClick}
              />
            </footer>
          </div>
        </Card>
      </div>
    );
  }
}

export default SettingsPage;
