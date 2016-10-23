import _ from 'lodash';
import { action, computed, observable } from 'mobx';

export class Guest {
  @observable affiliation = null;
  @observable allocatedTableNum = null;
  @observable id = null;
  @observable name = null;
  @observable partySize = null;
  @observable remarks = null;

  @observable lastState = {};

  @computed
  get asJSON() {
    return _.omitBy({
      affiliation: this.affiliation,
      allocatedTableNum: this.allocatedTableNum,
      id: this.id,
      name: this.name,
      partySize: this.partySize,
      remarks: this.remarks,
    }, _.isNil);
  }

  @computed
  get pristine() {
    return this.id === this.lastState.id &&
      this.affiliation === this.lastState.affiliation &&
      this.allocatedTableNum === this.lastState.allocatedTableNum &&
      this.name === this.lastState.name &&
      this.partySize === this.lastState.partySize &&
      this.remarks === this.lastState.remarks;
  }

  constructor(data) {
    if (data) {
      this.update(data);
    }
  }

  save() {
    return new Promise((resolve, reject) => {
      const childRef = this.ref.ref(this.id);

      childRef.update({
        affiliation: this.affiliation,
        allocatedTableNum: this.allocatedTableNum,
        name: this.name,
        partySize: this.partySize,
        remarks: this.remarks,
      }, (err) => {
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
    this.id = data.id;
    this.affiliation = data.affiliation;
    this.allocatedTableNum = data.allocatedTableNum;
    this.name = data.name;
    this.partySize = data.partySize;
    this.remarks = data.remarks;
  }
}

class GuestStore {
  firebase = null;
  ref = null;

  @observable items = null;

  @computed
  get asJSON() {
    return this.items && _.keyBy(this.items.map(i => i.asJSON), 'id');
  }

  constructor(firebase) {
    this.firebase = firebase;
    this.ref = firebase.database().ref('guests');

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
      this.ref.update(this.asJSON, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  @action
  update(guests) {
    this.items = _.map(guests, (guest, key) => new Guest({
      ...guest,
      id: key,
    }));
  }
}

export default GuestStore;
