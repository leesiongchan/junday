import { action, observable } from 'mobx';

class AppStore {
  @observable isGuestDialogOpen = false;
  @observable guest = null;

  @action
  toggleGuestDialog(open, guest) {
    this.isGuestDialogOpen = typeof open === 'boolean' ? open : !this.isGuestDialogOpen;
    this.guest = guest;
  }
}

export default AppStore;
