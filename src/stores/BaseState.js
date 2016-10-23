import _ from 'lodash';
import { action, computed, observable, transaction } from 'mobx';

class BaseState {
  @observable id = null;

  @observable $original = null;

  @computed
  get isNew() {
    return !this.id;
  }

  constructor(data) {
    if (data) {
      this.update(data);
    }
  }

  @action
  update(data) {
    transaction(() => {
      this.$original = { ...data };

      _.forEach(data, (prop, key) => {
        if ({}.hasOwnProperty.call(this, key)) {
          this[key] = prop;
        }
      });
    });
  }
}

export default BaseState;
