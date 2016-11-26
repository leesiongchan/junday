import { action, observable } from 'mobx';

import firebaseAdapter from './adapters/firebase-adapter';

class AuthStore {
  auth = null;
  firebaseAdapter = null;

  @observable isLoading = false;
  @observable user = null;

  constructor() {
    this.firebaseAdapter = firebaseAdapter;

    this.auth = this.firebaseAdapter.auth();

    this.setIsLoading(true);

    this.auth.onAuthStateChanged((user) => {
      this.setUser(user);
      this.setIsLoading(false);
    });
  }

  create({ email, password }) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  sendPasswordResetEmail(email) {
    return this.auth.sendPasswordResetEmail(email);
  }

  @action
  setIsLoading(loading) {
    this.isLoading = loading;
  }

  @action
  setUser(user) {
    this.user = user;
  }

  signIn({ email, password }) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  signOut() {
    return this.auth.signOut();
  }
}

export default AuthStore;
