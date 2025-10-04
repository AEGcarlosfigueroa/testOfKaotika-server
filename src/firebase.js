require('dotenv').config();
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// Parse the JSON from the environment variable
const firebaseConfig = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON); //XX

initializeApp({
    credential: cert(firebaseConfig),
});

// initializeApp({
//     credential: applicationDefault(),
// });

console.log("Firebase initialized");
const authentication = getAuth();

module.exports = { authentication };
