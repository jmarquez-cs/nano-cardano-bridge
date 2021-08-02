const { default: admin } = require('firebase-admin');
const serviceAccount = require("./ServiceAccountKey.json");

module.exports.getDb = () => {
  if (admin.apps.length == 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
  return admin.firestore();
}

module.exports.getAdmin = () => {
  if (admin.apps.length == 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
  return admin;
}