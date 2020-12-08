import { group } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClrLoadingState } from '@clr/angular';
import { ChatsService } from 'src/app/services/chats.service';

@Component({
  selector: 'app-create-group-chat',
  templateUrl: './create-group-chat.component.html',
  styleUrls: ['./create-group-chat.component.scss'],
})
export class CreateGroupChatComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  public opened = true;
  public groupChatForm: FormGroup;
  public btnState = ClrLoadingState.DEFAULT;

  constructor(private fb: FormBuilder, private chatsService: ChatsService) {}

  ngOnInit(): void {
    this.groupChatForm = this.fb.group({
      displayName: '',
      type: 'group',
      createdAt: Date.now(),
      messages: this.fb.array([]),
      members: this.fb.array([]),
    });
  }

  public onSubmit() {
    this.chatsService
      .createGroup(this.groupChatForm.value)
      .then(() => {
        this.btnState = ClrLoadingState.SUCCESS;
        this.closeModal.emit();
      })
      .catch(() => (this.btnState = ClrLoadingState.ERROR));
  }
}
