import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { UPost } from 'src/app/models/post.interface';
import {
  PostsService,
  AuthenticationService,
  FilesService,
} from 'src/app/services';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.scss'],
})
export class UpdatePostComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Input() post: UPost;
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(
    private postsService: PostsService,
    private authService: AuthenticationService,
    public fileService: FilesService
  ) {}

  ngOnInit(): void {}

  uploadFile(file: any) {
    this.fileService.uploadFile(file);
  }

  onSubmit(post: UPost) {
    this.buttonState = ClrLoadingState.LOADING;
    post.uid = this.authService.user.uid;
    post.imageUrl = post?.imageUrl
      ? post?.imageUrl
      : this.fileService.downloadURL
      ? this.fileService.downloadURL
      : '';
    this.postsService.updatePost(post).then(
      () => {
        this.closeModal.emit();
        this.buttonState = ClrLoadingState.SUCCESS;
      },
      () => {
        this.buttonState = ClrLoadingState.ERROR;
      }
    );
  }
}
