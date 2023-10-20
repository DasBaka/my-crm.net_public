import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/main/1-home/home.component';
import { OrdersComponent } from './modules/main/2-orders/orders.component';
import { UsersComponent } from './modules/main/3-users/users.component';
import { ResponsibleComponent } from './modules/main/5-restaurant/responsible/responsible.component';
import { TagsComponent } from './modules/main/4-dishes/tags/tags.component';
import { DishListComponent } from './modules/main/4-dishes/dish-list/dish-list.component';
import { AddDishComponent } from './modules/main/4-dishes/add-dish/add-dish.component';
import { DeliveryHoursComponent } from './modules/main/5-restaurant/delivery-hours/delivery-hours.component';
import { UserDetailsComponent } from './modules/main/3-users/user-details/user-details.component';
import { StatsComponent } from './modules/main/5-restaurant/stats/stats.component';
import { OrderOverviewComponent } from './modules/main/2-orders/order-overview/order-overview.component';
import { OrderDetailsComponent } from './modules/main/2-orders/order-details/order-details.component';

const routes: Routes = [
  { path: 'home', title: 'Home | MyCRM', component: HomeComponent },
  {
    path: 'dishes',
    children: [
      {
        path: 'tags',
        title: 'Tags | MyCRM',
        component: TagsComponent,
      },
      {
        path: 'list',
        title: 'Dishes | MyCRM',
        component: DishListComponent,
      },
      {
        path: 'list/edit',
        title: 'Edit dish | MyCRM',
        component: AddDishComponent,
      },

      {
        path: 'add-dish',
        title: 'Add new dish | MyCRM',
        component: AddDishComponent,
      },
    ],
  },
  {
    path: 'orders',
    children: [
      { path: 'board', title: 'My Board | MyCRM', component: OrdersComponent },
      {
        path: 'overview',
        title: 'Overview | MyCRM',
        component: OrderOverviewComponent,
      },
      {
        path: 'details',
        title: 'Order details | MyCRM',
        component: OrderDetailsComponent,
      },
    ],
  },
  {
    path: 'users',
    children: [
      { path: '', title: 'Users | MyCRM', component: UsersComponent },
      {
        path: 'details',
        title: 'User Details | MyCRM',
        component: UserDetailsComponent,
      },
    ],
  },
  {
    path: 'restaurant',
    children: [
      {
        path: 'responsible',
        title: 'Restaurant Settings | MyCRM',
        component: ResponsibleComponent,
      },
      {
        path: 'hours',
        title: 'Restaurant Opening Hours | MyCRM',
        component: DeliveryHoursComponent,
      },
      {
        path: 'stats',
        title: 'Restaurant Overview | MyCRM',
        component: StatsComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
