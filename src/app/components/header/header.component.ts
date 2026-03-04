import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AdminNotificationsService } from 'src/app/services/admin-notifications.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  unreadCount$: Observable<number> = of(0);

  constructor(
    public authService: AuthenticationService,
    private afAuth: AngularFireAuth,
    private notificationsService: AdminNotificationsService
  ) {}

  ngOnInit(): void {
    this.unreadCount$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(0);
        }
        return this.notificationsService.getUnreadCount(user.uid);
      })
    );
  }
}
