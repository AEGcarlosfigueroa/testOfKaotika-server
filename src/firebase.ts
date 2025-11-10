import * as dotenv from 'dotenv'

dotenv.config();

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import { getMessaging } from 'firebase-admin/messaging';

initializeApp({
    credential: applicationDefault(),
});
console.log("GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS);
const authentication = getAuth();
const messaging = getMessaging();

export { authentication, messaging }
