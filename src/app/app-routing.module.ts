import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { RestaurantsComponent } from './main/restaurants/restaurants.component';
import { RestaurantDetailsComponent } from './main/restaurants/restaurant-details/restaurant-details.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'restaurants',
    component: RestaurantsComponent,
  },
  { path: 'restaurants/details', component: RestaurantDetailsComponent },

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
