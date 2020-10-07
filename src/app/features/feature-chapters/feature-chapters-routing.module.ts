import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListChaptersComponent } from './list-chapters/list-chapters.component';
import { ViewChapterComponent } from './view-chapter/view-chapter.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ListChaptersComponent },
  { path: 'view-chapter/:chapterId', component: ViewChapterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureChaptersRoutingModule {}
