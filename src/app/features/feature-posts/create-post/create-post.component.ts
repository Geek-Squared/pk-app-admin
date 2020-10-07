import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { UPost } from 'src/app/models/post.interface';
import {
  AuthenticationService,
  FilesService,
  PostsService,
} from 'src/app/services';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Input() chapterId: string ;
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
    post.imageUrl = this.fileService.downloadURL
      ? this.fileService.downloadURL
      : '';
    post.createdDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    post.chapterId = this.chapterId;
    this.postsService.createPost(post).then(
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
