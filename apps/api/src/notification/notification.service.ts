import { Injectable } from '@nestjs/common';
import admin, { ensureFirebaseInitialized } from '../firebase';

@Injectable()
export class NotificationService {
  async sendNotification(token: string, title: string, body: string) {
    ensureFirebaseInitialized();
    await admin.messaging().send({
      token,
      notification: {
        title,
        body,
      },
      // data:data,
    });
  }
}
