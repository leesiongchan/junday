import _ from 'lodash';
import { action, computed, observable } from 'mobx';

import firebaseAdapter from './adapters/firebase-adapter';

class BaseStore {
  firebaseAdapter = null;
  ref = null;

  @observable items = [];
  @observable pendingRequestCount = 0;

  @computed
  get isLoading() {
    return this.pendingRequestCount > 0;
  }

  constructor(ref, State) {
    this.firebaseAdapter = firebaseAdapter;

    this.ref = this.firebaseAdapter.database().ref(ref);
    this.State = State;

    this.addPendingRequestCount(1);

    this.ref.on('value', (snapshot) => {
      this.update(snapshot.val());
      this.addPendingRequestCount(-1);
    });
  }

  add(data) {
    return new Promise((resolve, reject) => {
      this.ref.push(data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  @action
  addPendingRequestCount(count) {
    this.pendingRequestCount += count;
  }

  save(id, data) {
    return new Promise((resolve, reject) => {
      const newData = {
        ...data,
        id,
      };

      this.ref.child(id).update(newData, (err) => {
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
    this.items = _.map(data, (d, key) => new this.State({
      ...d,
      id: key,
    }));
  }
}

export default BaseStore;
