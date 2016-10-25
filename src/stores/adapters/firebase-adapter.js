import firebaseInstance from 'firebase';

import config from 'config';

class FirebaseAdapter {
  auth = null;
  database = null;
  firebase = null;

  constructor() {
    this.firebase = firebaseInstance.initializeApp({
      apiKey: config.FIREBASE.API_KEY,
      authDomain: config.FIREBASE.AUTH_DOMAIN,
      databaseURL: config.FIREBASE.DATABASE_URL,
      storageBucket: config.FIREBASE.STORAGE_BUCKET,
    });

    this.auth = this.firebase.auth;
    this.database = this.firebase.database;
  }
}

export default new FirebaseAdapter();
