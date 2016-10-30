import _ from 'lodash';
import { action, computed, observable, toJS } from 'mobx';

import BaseState from './BaseState';
import BaseStore from './BaseStore';

export class Table extends BaseState {
  guestStore = null;

  @observable tableNum = null;

  @computed
  get guests() {
    return this.guestStore.items.filter(g => (
      g.allocatedTableNum === this.tableNum
    ));
  }

  @computed
  get numPeople() {
    return this.guestStore.items.reduce((n, g) => (
      g.allocatedTableNum === this.tableNum ? n + parseInt(g.partySize, 10) : n
    ), 0);
  }

  @computed
  get pristine() {
    return this.id === this.$original.id &&
      this.tableNum === this.$original.tableNum;
  }

  constructor(data, guestStore) {
    super(data);

    this.guestStore = guestStore;
  }
}

class TableStore extends BaseStore {
  guestStore = null;

  constructor(authStore, guestStore) {
    super(authStore, 'tables', Table);

    this.guestStore = guestStore;
  }

  save() {
    return new Promise((resolve, reject) => {
      const data = _(toJS(this.items))
        .map(i => _.omit(i, ['guestStore', '$original']))
        .keyBy('id')
        .value();

      this.ref.set(data, (err) => {
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
    }, this.guestStore));
  }
}

export default TableStore;
