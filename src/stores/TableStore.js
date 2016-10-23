import _ from 'lodash';
import { action, computed, observable } from 'mobx';

export class Table {
  guestStore = null;

  @observable id = null;
  @observable ref = null;
  @observable tableNum = null;

  @observable lastState = {};

  @computed
  get asJSON() {
    return _.omitBy({
      id: this.id,
      numPeople: this.numPeople,
      tableNum: this.tableNum,
    }, _.isNil);
  }

  @computed
  get numPeople() {
    return this.guestStore
      ? this.guestStore.items.reduce((n, i) => (
        i.allocatedTableNum === this.tableNum ? n + parseInt(i.partySize, 10) : n
      ), 0)
      : 0;
  }

  @computed
  get pristine() {
    return this.id === this.lastState.id &&
      this.tableNum === this.lastState.tableNum;
  }

  constructor(data, guestStore) {
    if (data) {
      this.guestStore = guestStore;
      this.update(data);
    }
  }

  save() {
    return new Promise((resolve, reject) => {
      this.ref.update({
        tableNum: this.tableNum,
      }, err => {
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
    this.id = data.id;
    this.lastState = { ...data };
    this.ref = data.ref;
    this.tableNum = data.tableNum;
  }
}

class TableStore {
  firebase = null;
  guestStore = null;
  ref = null;

  @observable items = null;

  @computed
  get asJSON() {
    return this.items && _.keyBy(this.items.map(i => i.asJSON), 'id');
  }

  constructor(firebase, guestStore) {
    this.firebase = firebase;
    this.ref = firebase.database().ref('tables');
    this.guestStore = guestStore;

    this.ref.on('value', snapshot => {
      this.update(snapshot.val());
    });
  }

  add(data) {
    return new Promise((resolve, reject) => {
      this.ref.push(data, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      this.ref.set(this.asJSON, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  @action
  update(tables) {
    this.items = _.map(tables, (table, key) => new Table({
      ...table,
      id: key,
      ref: this.ref.child(key),
    }, this.guestStore));
  }
}

export default TableStore;
