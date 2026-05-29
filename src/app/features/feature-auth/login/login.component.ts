import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  showPw = false;
  loading = false;

  constructor(private authService: AuthenticationService) {}
  ngOnInit(): void {}

  onSubmit() {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.authService.login(this.email, this.password)
      .finally(() => { this.loading = false; })
      .catch(() => { this.loading = false; });
  }
}
