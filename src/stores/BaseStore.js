import _ from 'lodash';
import { action, observable } from 'mobx';

import firebaseAdapter from './adapters/firebase-adapter';

class BaseStore {
  firebaseAdapter = null;
  ref = null;

  @observable items = [];
  @observable isLoading = false;

  constructor(ref, State) {
    this.firebaseAdapter = firebaseAdapter;

    this.ref = this.firebaseAdapter.database().ref(ref);
    this.State = State;

    this.setLoading(true);

    this.ref.on('value', (snapshot) => {
      this.update(snapshot.val());
      this.setLoading(false);
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
  setLoading(loading) {
    this.isLoading = loading;
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
