import { action, observable } from 'mobx';

import BaseStore from './BaseStore';

class NotificationStore extends BaseStore {
  @observable message = '';
  @observable open = false;

  @observable $original = {};

  constructor(authStore) {
    super(authStore, 'notifications');
  }

  save(formData) {
    return new Promise((resolve, reject) => {
      this.ref.update(formData, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  @action
  update(data) {
    this.$original = { ...data };
    this.message = data.message;
    this.open = data.open;
  }
}

export default NotificationStore;
