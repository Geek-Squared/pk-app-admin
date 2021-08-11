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
      { path: '', redirectTo: 'interventions', pathMatch: 'full' },
      {
        path: 'interventions',
        loadChildren: () =>
          import(
            './features/feature-interventions/feature-interventions.module'
          ).then((mod) => mod.FeatureInterventionsModule),
      },
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
      {
        path: 'work-books',
        loadChildren: () =>
          import('./features/feature-workbooks/feature-workbooks.module').then(
            (mod) => mod.FeatureWorkbooksModule
          ),
      },
      {
        path: 'messages',
        loadChildren: () =>
          import('./features/feature-messaging/feature-messaging.module').then(
            (mod) => mod.FeatureMessagingModule
          ),
      },
      {
        path: 'feedback',
        loadChildren: () =>
          import('./features/feature-feedback/feature-feedback.module').then(
            (mod) => mod.FeatureFeedbackModule
          ),
      },
      {
        path: 'referrals',
        loadChildren: () =>
          import('./features/feature-referrals/feature-referrals.module').then(
            (mod) => mod.FeatureReferralsModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./features/feature-users/feature-users.module').then(
            (m) => m.FeatureUsersModule
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
