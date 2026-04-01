import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { UsersService } from 'src/app/services';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  @Input() user: any;
  @Output() closeModal = new EventEmitter();
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {}

  onSubmit(request) {
    this.buttonState = ClrLoadingState.LOADING;
    const { displayName, role } = request;
    this.usersService
      .updateUser(this.user.id, { displayName, role })
      .then(() => {
        this.buttonState = ClrLoadingState.SUCCESS;
        setTimeout(() => {
          this.closeModal.emit();
        }, 500);
      })
      .catch(() => {
        this.buttonState = ClrLoadingState.ERROR;
      });
  }
}
