import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Roles } from './models/roles';
import { AdminMessagingService } from './services/admin-messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'positive-konnections-admin';

  constructor(
    private authService: AuthenticationService,
    private adminMessaging: AdminMessagingService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user?.role === Roles.Admin) {
        this.adminMessaging.init();
      }
    });
  }
}
