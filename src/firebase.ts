import * as dotenv from 'dotenv'
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import { getMessaging } from 'firebase-admin/messaging';

dotenv.config();

initializeApp({
    credential: applicationDefault(),
});

console.log("GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS);

const authentication = getAuth();

const messaging = getMessaging();

export { authentication, messaging }
