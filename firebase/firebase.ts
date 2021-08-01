import admin from 'firebase-admin';
const { Storage } = require('@google-cloud/storage');
const serviceAccount = require("./ServiceAccountKey.json");

function getDb() {
    if (admin.apps.length == 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
    return admin.firestore();
}

function getAdmin() {
    if (admin.apps.length == 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
    return admin;
}

async function getFirestore() {
    const storage = new Storage({
        projectId: serviceAccount.project_id,
        credentials: {
            private_key: serviceAccount.private_key,
            client_email: serviceAccount.client_email,
        }
    })

    let bucket = await storage.bucket(serviceAccount.bucket_id)

    return bucket;
}

export const db = getDb();
export const firebase = getAdmin();
export const firestore = getFirestore()