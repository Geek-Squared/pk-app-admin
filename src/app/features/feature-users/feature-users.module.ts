import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureUsersRoutingModule } from './feature-users-routing.module';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { UsersUiModule } from '../../ui/users-ui/users-ui.module';
import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [CreateUserComponent, ListUsersComponent, EditUserComponent],
  imports: [
    CommonModule,
    FeatureUsersRoutingModule,
    UsersUiModule,
    ClarityModule,
  ],
})
export class FeatureUsersModule {}
