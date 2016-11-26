import { action, observable } from 'mobx';

class AppStore {
  @observable guest = null;
  @observable isGuestFormDialogOpen = false;
  @observable isSignUpFormDialogOpen = false;

  @action
  toggleGuestFormDialog(open, guest) {
    this.isGuestFormDialogOpen = typeof open === 'boolean' ? open : !this.isGuestFormDialogOpen;
    this.guest = guest;
  }

  @action
  toggleSignUpFormDialog(open) {
    this.isSignUpFormDialogOpen = typeof open === 'boolean' ? open : !this.isSignUpFormDialogOpen;
  }
}

export default AppStore;
