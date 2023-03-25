## iOS 

### PushNotificationService._correctIOSNotification

Если приложение не запушено, пуш приходит в "корявом" формате: 

```json
{
  "_data": {
    "remote": true
  },
  "_remoteNotificationCompleteCallbackCalled": false,
  "_isRemote": true,
  "_alert": {
    "title": "Test",
    "body": "Test",
    "front_action": "News"
  },
  "_sound": "default",
  "_badgeCount": 1
}
```
