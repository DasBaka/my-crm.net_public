import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { OrdersComponent } from './main/orders/orders.component';
import { UsersComponent } from './main/users/users.component';
import { SettingsComponent } from './main/settings/settings.component';
import { DishesOverviewComponent } from './main/dishes/dishes-overview/dishes-overview.component';
import { TagsComponent } from './main/dishes/tags/tags.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'dishes',
    children: [
      {
        path: 'tags',
        component: TagsComponent,
        children: [
          { path: '', component: DishesOverviewComponent, outlet: 'tags-list' },
        ],
      },
    ],
  },
  { path: 'orders', component: OrdersComponent },
  { path: 'users', component: UsersComponent },
  { path: 'settings', component: SettingsComponent },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
