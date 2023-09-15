import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/main/1-home/home.component';
import { OrdersComponent } from './modules/main/2-orders/orders.component';
import { UsersComponent } from './modules/main/3-users/users.component';
import { SettingsComponent } from './modules/main/5-restaurant/settings/settings.component';
import { DishesOverviewComponent } from './modules/main/4-dishes/dishes-overview/dishes-overview.component';
import { TagsComponent } from './modules/main/4-dishes/tags/tags.component';
import { DishListComponent } from './modules/main/4-dishes/dish-list/dish-list.component';
import { AddDishComponent } from './modules/main/4-dishes/add-dish/add-dish.component';

const routes: Routes = [
  { path: 'home', title: 'Home | MyCRM', component: HomeComponent },
  {
    path: 'dishes',
    children: [
      {
        path: 'tags',
        title: 'Tags | MyCRM',
        component: TagsComponent,
        children: [
          { path: '', component: DishesOverviewComponent, outlet: 'tags-list' },
        ],
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
        path: 'add',
        title: 'Add Dish | MyCRM',
        component: AddDishComponent,
      },
    ],
  },
  { path: 'orders', component: OrdersComponent },
  { path: 'users', component: UsersComponent },
  { path: 'settings', component: SettingsComponent },
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
