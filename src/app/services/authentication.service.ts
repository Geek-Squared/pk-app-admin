import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Utilities } from '../models/utils';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  user: firebase.User;
  user$: Observable<any>;

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    public afs: AngularFirestore,
    private functions: AngularFireFunctions
  ) {
    this.cacheSession();

    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  /**
   * Mirrors the signed-in user into sessionStorage for the parts of the app
   * that read a uid synchronously (chats, sidenav). It is a CACHE — never the
   * source of truth for whether someone is signed in; AuthGuard asks the SDK.
   *
   * Subscribed exactly once, here. It used to be re-subscribed on every login
   * and to navigate on every emission, which stacked listeners and threw the
   * user back to the root on any auth event — including a token refresh while
   * they were deep in a page.
   */
  private cacheSession(): void {
    this.afAuth.authState.subscribe((user) => {
      this.user = user;
      if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
      } else {
        sessionStorage.removeItem('user');
      }
    });
  }

  async login(email: string, password: string) {
    await this.afAuth.signInWithEmailAndPassword(email, password);
    // Navigate here rather than from the authState subscription, so signing in
    // is the only thing that moves someone to the dashboard.
    await this.router.navigate(['']);
  }

  /**
   * Creates a staff or client account through a Cloud Function.
   *
   * This used to call createUserWithEmailAndPassword on the CLIENT SDK, which
   * switches the signed-in user to the account it just created — so an admin
   * creating a counsellor was silently logged in as that counsellor. It also
   * raced processSignUp, which stamps role 'client' on every new account, so
   * the new counsellor could come back as a client.
   *
   * Server-side provisioning fixes both: one call, ordered, with the acting
   * user's own rights checked before anything is created.
   */
  async register(
    email: string,
    password: string,
    displayName: string,
    role: string
  ) {
    try {
      const create = this.functions.httpsCallable('createStaffUser');
      await create({ email, password, displayName, role }).toPromise();
      Utilities.displayToast('success', `${displayName} created.`);
    } catch (error: any) {
      Utilities.displayToast(
        'error',
        Utilities.firestoreErrorMessage(error, 'Could not create the account.')
      );
      throw error;
    }
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.sendPasswordResetEmail(passwordResetEmail);
  }

  async logout() {
    await this.afAuth.signOut();
    sessionStorage.removeItem('user');
    this.router.navigate(['auth/login']);
  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }
}
