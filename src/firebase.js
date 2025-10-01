require('dotenv').config();

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const {getAuth} = require('firebase-admin/auth')

initializeApp({
    credential: applicationDefault(),
});
console.log("GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS);
const authentication = getAuth()

module.exports = { authentication }; // export it
