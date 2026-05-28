import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClrLoadingState } from '@clr/angular';
import { ChatsService } from 'src/app/services/chats.service';
import { UsersService } from 'src/app/services';

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
  public users: any[] = [];
  public selectedUids: string[] = [];
  public isLoadingUsers = true;

  constructor(
    private fb: FormBuilder,
    private chatsService: ChatsService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.groupChatForm = this.fb.group({
      displayName: ['', Validators.required],
    });

    this.usersService.getUsers().subscribe((actions: any[]) => {
      this.users = actions.map((a) => ({
        id: a.payload.doc.id,
        ...a.payload.doc.data(),
      }));
      this.isLoadingUsers = false;
    });
  }

  toggleUser(uid: string): void {
    const index = this.selectedUids.indexOf(uid);
    if (index > -1) {
      this.selectedUids.splice(index, 1);
    } else {
      this.selectedUids.push(uid);
    }
  }

  isSelected(uid: string): boolean {
    return this.selectedUids.includes(uid);
  }

  public onSubmit(): void {
    if (this.groupChatForm.invalid || !this.groupChatForm.value.displayName?.trim()) {
      return;
    }

    this.btnState = ClrLoadingState.LOADING;

    const creatorUid = JSON.parse(sessionStorage.getItem('user'))?.uid;
    const uids = this.selectedUids.includes(creatorUid)
      ? this.selectedUids
      : [creatorUid, ...this.selectedUids];

    const data = {
      displayName: this.groupChatForm.value.displayName.trim(),
      type: 'group',
      uids,
      messages: [],
      createdAt: Date.now(),
      createdBy: creatorUid,
    };

    this.chatsService
      .createGroup(data)
      .then(() => {
        this.btnState = ClrLoadingState.SUCCESS;
        this.closeModal.emit();
      })
      .catch(() => {
        this.btnState = ClrLoadingState.ERROR;
      });
  }
}
