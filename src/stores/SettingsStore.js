import _ from 'lodash';
import { action, computed, observable } from 'mobx';

import BaseStore from './BaseStore';

class SettingsStore extends BaseStore {
  tableStore = null;

  @observable numTables = null;
  @observable seatingCapacity = null;

  @observable $original = {};

  @computed
  get pristine() {
    return this.numTables === this.$original.numTables &&
      this.seatingCapacity === this.$original.seatingCapacity;
  }

  constructor(tableStore) {
    super('settings');

    this.tableStore = tableStore;
  }

  @action
  rearrangeTables() {
    const promises = [];

    if (this.numTables > this.tableStore.items.length) {
      const lastTable = _.last(this.tableStore.items) || {};
      let tableNum = lastTable.tableNum || this.tableStore.items.length;

      for (let i = this.tableStore.items.length; i < this.numTables; i++) {
        promises.push(this.tableStore.add({
          tableNum: ++tableNum,
        }));
      }
    } else {
      this.tableStore.items = this.tableStore.items.slice(0, this.numTables);
      this.tableStore.save();
    }

    return Promise.all(promises);
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
    this.numTables = data.numTables;
    this.seatingCapacity = data.seatingCapacity;
  }
}

export default SettingsStore;
