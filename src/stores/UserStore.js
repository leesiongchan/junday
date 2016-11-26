import { computed, observable } from 'mobx';

import BaseState from './BaseState';
import BaseStore from './BaseStore';

export class User extends BaseState {
  @observable email = null;
  @observable role = null;

  @computed
  get pristine() {
    return this.id === this.$original.id && this.email === this.$original.email;
  }
}

class UserStore extends BaseStore {
  constructor(authStore) {
    super(authStore, 'users', User);
  }
}

export default UserStore;
