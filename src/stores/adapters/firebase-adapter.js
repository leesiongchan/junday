import firebaseInstance from 'firebase';

import config from 'config';

class FirebaseAdapter {
  database = null;
  firebase = null;

  constructor() {
    this.firebase = firebaseInstance.initializeApp({
      apiKey: config.FIREBASE.API_KEY,
      authDomain: config.FIREBASE.AUTH_DOMAIN,
      databaseURL: config.FIREBASE.DATABASE_URL,
      storageBucket: config.FIREBASE.STORAGE_BUCKET,
    });

    this.database = this.firebase.database;
  }
}

export default new FirebaseAdapter();
