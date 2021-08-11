import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClrLoadingState } from '@clr/angular';
import { AuthenticationService } from 'src/app/services';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(request) {
    this.buttonState = ClrLoadingState.LOADING;
    this.authService
      .register(
        request?.email,
        request?.password,
        request?.displayName,
        request?.role
      )
      .then(() => {
        this.closeModal.emit();
        this.buttonState = ClrLoadingState.SUCCESS;
        setTimeout(() => {
          this.router.navigate(['/users/list']);
        });
      })
      .catch(() => {
        this.buttonState = ClrLoadingState.ERROR;
      });
  }
}
