import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Utilities } from '../models/utils';
import { WorkbooksService } from './workbooks.service';
import { Roles } from '../models/roles';
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
    private workBooksService: WorkbooksService
  ) {
    this.setUser();

    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      }),
      tap((profile) => console.log('Current User Profile from DB:', profile))
    );
  }

  private setUser() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        console.log('Current Auth User:', this.user);
        sessionStorage.setItem('user', JSON.stringify(this.user));
        this.router.navigate(['']);
      } else {
        sessionStorage.setItem('user', null);
      }
    });
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password).then(() => {
      this.setUser();
    });
  }

  async register(
    email: string,
    password: string,
    displayName: string,
    _role: string
  ) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      this.SetUserData(result?.user, displayName, _role);
      this.sendEmailVerification();
      if ((_role = Roles.Client)) {
        this.workBooksService.create(result?.user);
        this.createClientChat(result?.user, displayName);
      }
    } catch (error) {
      return Utilities.displayToast(
        'error',
        error?.message ? error?.message : 'An error has occurred'
      );
    }
  }

  async sendEmailVerification() {
    await (await this.afAuth.currentUser).sendEmailVerification();
    this.router.navigate(['verify-email']);
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.sendPasswordResetEmail(passwordResetEmail);
  }

  async logout() {
    await this.afAuth.signOut();
    sessionStorage.removeItem('user');
    this.router.navigate(['auth/login']);
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(sessionStorage.getItem('user'));
    return user !== null;
  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }

  async SetUserData(user: firebase.User, displayName: string, role: string) {
    await user
      .updateProfile({ displayName })
      .catch((error) =>
        Utilities.displayToast(
          'error',
          error?.message ? error?.message : 'An error has occurred'
        )
      );

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: any = {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      role,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  async createClientChat(user: firebase.User, displayName: string) {
    const data = {
      uid: user?.uid,
      displayName: displayName,
      createdAt: Date.now(),
      count: 0,
      messages: [],
    };

    await this.afs.collection('chats').add(data);
  }
}
