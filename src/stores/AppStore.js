import { action, observable } from 'mobx';

class AppStore {
  @observable guest = null;
  @observable isGuestDialogOpen = false;

  @action
  toggleGuestDialog(open, guest) {
    this.isGuestDialogOpen = typeof open === 'boolean' ? open : !this.isGuestDialogOpen;
    this.guest = guest;
  }
}

export default AppStore;
