import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  user: User;
  user$: Observable<any>;

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    public afs: AngularFirestore
  ) {
    this.setUser();

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

  private setUser() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
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

  async register(email: string, password: string) {
    await this.afAuth.createUserWithEmailAndPassword(email, password);
    this.sendEmailVerification();
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
}
