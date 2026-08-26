import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    // Gate on the live Firebase session, never on the sessionStorage snapshot.
    // That snapshot is a cache: it cannot tell whether the token expired, was
    // revoked, or the account was disabled, and anyone can type one in — which
    // made this guard a door with no lock. The reads behind it were the only
    // real protection.
    //
    // take(1) waits for auth persistence to be restored before settling, so a
    // reload on a deep link does not bounce to the login page.
    return this.afAuth.authState.pipe(
      take(1),
      map((user) => (user ? true : this.router.createUrlTree(['auth/login'])))
    );
  }
}
