import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturePostsRoutingModule } from './feature-posts-routing.module';
import { CreatePostComponent } from './create-post/create-post.component';
import { UpdatePostComponent } from './update-post/update-post.component';
import { DeletePostComponent } from './delete-post/delete-post.component';
import { ListPostsComponent } from './list-posts/list-posts.component';
import { ClarityModule } from '@clr/angular';
import { ViewPostComponent } from './view-post/view-post.component';
import { PostsUiModule, SharedUiModule } from '../../ui';

@NgModule({
  declarations: [
    CreatePostComponent,
    UpdatePostComponent,
    DeletePostComponent,
    ListPostsComponent,
    ViewPostComponent,
  ],
  exports: [
    CreatePostComponent,
    UpdatePostComponent,
    DeletePostComponent,
    ListPostsComponent,
    ViewPostComponent,
  ],
  imports: [
    CommonModule,
    FeaturePostsRoutingModule,
    ClarityModule,
    PostsUiModule,
    SharedUiModule,
  ],
})
export class FeaturePostsModule {}
