import * as dotenv from 'dotenv';
dotenv.config();
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
initializeApp({
    credential: applicationDefault(),
});
console.log("GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS);
const authentication = getAuth();
export { authentication };
