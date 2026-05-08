import * as admin from 'firebase-admin';

import serviceAccount from './config/eghealthcare-b1daa-firebase-adminsdk-fbsvc-f24e172a1d.json';

admin.initializeApp({
  credential: admin.credential.cert(
    serviceAccount as admin.ServiceAccount,
  ),
});

export default admin;