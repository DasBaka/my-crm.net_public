import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { RestaurantsComponent } from './main/restaurants/restaurants.component';
import { TableComponent } from './main/restaurants/table/table.component';
import { DishesOverviewComponent } from './main/dishes/dishes-overview/dishes-overview.component';
import { OrdersComponent } from './main/orders/orders.component';
import { UsersComponent } from './main/users/users.component';
import { SettingsComponent } from './main/settings/settings.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dishes/overview', component: DishesOverviewComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'users', component: UsersComponent },
  { path: 'settings', component: SettingsComponent },
  {
    path: 'restaurants',
    component: RestaurantsComponent,
    children: [
      {
        path: 'overview',
        component: TableComponent,
      },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },

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
