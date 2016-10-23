import _ from 'lodash';
import { action, autorun, computed, observable, transaction, when } from 'mobx';

class SettingStore {
  firebase = null;
  ref = null;
  tableStore = null;

  @observable numTables = null;
  @observable seatingCapacity = null;

  @observable lastState = {};

  @computed
  get pristine() {
    return this.numTables === this.lastState.numTables && this.seatingCapacity === this.lastState.seatingCapacity;
  }

  constructor(firebase, tableStore) {
    this.firebase = firebase;
    this.ref = firebase.database().ref('settings');
    this.tableStore = tableStore;

    this.ref.on('value', snapshot => {
      this.update(snapshot.val() || {});
    });
  }

  @action
  rearrangeTables() {
    if (this.numTables > this.tableStore.items.length) {
      const lastTable = _.last(this.tableStore.items) || {};
      let tableNum = lastTable.tableNum || this.tableStore.items.length;

      for (let i = this.tableStore.items.length; i < this.numTables; i++) {
        this.tableStore.add({
          tableNum: ++tableNum,
        });
      }
    } else {
      this.tableStore.items = this.tableStore.items.slice(0, this.numTables);
      this.tableStore.save();
    }
  }

  save() {
    return new Promise((resolve, reject) => {
      this.ref.update({
        numTables: this.numTables,
        seatingCapacity: this.seatingCapacity,
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
    this.lastState = { ...data };
    this.numTables = data.numTables;
    this.seatingCapacity = data.seatingCapacity;
  }
}

export default SettingStore;
