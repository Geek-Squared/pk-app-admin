# PositiveKonnectionsAdmin

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Web Notifications (Workbook Completion)

Plan and flow:
1. The mobile/web app writes workbook responses to `workbooks/{workbookId}`.
2. A Cloud Function detects when all posts are completed and marks the workbook as completed.
3. The same function writes an `adminNotifications` record and sends an FCM push to all admin web tokens.
4. Admins receive browser notifications via `firebase-messaging-sw.js`.

Setup checklist:
1. Create a Web Push certificate in Firebase Console and copy the public VAPID key.
2. Set `fcmVapidKey` in `src/environments/environment.ts` and `src/environments/environment.prod.ts`.
3. Confirm `src/firebase-messaging-sw.js` has the correct Firebase config.
4. Deploy Cloud Functions from `pk-app-latest/functions` (includes `onWorkbookCompletion`).
5. Deploy admin hosting so `/firebase-messaging-sw.js` is served at the root.

Notes:
- Web push requires HTTPS (or localhost).
- Admin tokens are stored on the `users/{uid}` document as `webFcmTokens`.
