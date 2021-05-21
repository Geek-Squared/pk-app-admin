import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureChaptersRoutingModule } from './feature-chapters-routing.module';
import { ListChaptersComponent } from './list-chapters/list-chapters.component';
import { CreateChapterComponent } from './create-chapter/create-chapter.component';
import { ClarityModule } from '@clr/angular';
import { ChaptersUiModule } from 'src/app/ui';
import { ViewChapterComponent } from './view-chapter/view-chapter.component';
import { DeleteChapterComponent } from './delete-chapter/delete-chapter.component';
import { UpdateChapterComponent } from './update-chapter/update-chapter.component';
import { FeaturePostsModule } from '../feature-posts/feature-posts.module';

@NgModule({
  declarations: [
    ListChaptersComponent,
    CreateChapterComponent,
    ViewChapterComponent,
    DeleteChapterComponent,
    UpdateChapterComponent,
  ],
  imports: [
    CommonModule,
    FeatureChaptersRoutingModule,
    ClarityModule,
    ChaptersUiModule,
    FeaturePostsModule,
  ],
  exports: [ListChaptersComponent],
})
export class FeatureChaptersModule {}
