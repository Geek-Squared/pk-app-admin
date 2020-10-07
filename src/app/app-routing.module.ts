import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortalContainerComponent } from './components/portal-container/portal-container.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PortalContainerComponent,
    canActivate: [AuthGuard],
    /*   resolve: { userDetails: UserProfileResolverService }, */
    children: [
      {
        path: 'posts',
        loadChildren: () =>
          import('./features/feature-posts/feature-posts.module').then(
            (mod) => mod.FeaturePostsModule
          ),
      },
      {
        path: 'chapters',
        loadChildren: () =>
          import('./features/feature-chapters/feature-chapters.module').then(
            (mod) => mod.FeatureChaptersModule
          ),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/feature-auth/feature-auth.module').then(
        (mod) => mod.FeatureAuthModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
