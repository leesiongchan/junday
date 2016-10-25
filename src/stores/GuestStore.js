import { computed, observable } from 'mobx';

import BaseState from './BaseState';
import BaseStore from './BaseStore';

export class Guest extends BaseState {
  @observable affiliation = null;
  @observable allocatedTableNum = null;
  @observable name = null;
  @observable partySize = null;
  @observable remarks = null;

  @computed
  get pristine() {
    return this.id === this.$original.id &&
      this.affiliation === this.$original.affiliation &&
      this.allocatedTableNum === this.$original.allocatedTableNum &&
      this.name === this.$original.name &&
      this.partySize === this.$original.partySize &&
      this.remarks === this.$original.remarks;
  }
}

class GuestStore extends BaseStore {
  constructor(authStore) {
    super(authStore, 'guests', Guest);
  }
}

export default GuestStore;
