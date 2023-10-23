import { Component, inject } from '@angular/core';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { CustomerProfile } from 'src/models/interfaces/customer-profile';
import { DishProfile } from 'src/models/interfaces/dish-profile.interface';
import { OrderProfile } from 'src/models/interfaces/order-profile';
import { RestaurantProfile } from 'src/models/interfaces/restaurant-profile.interface';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent {
  restaurant!: RestaurantProfile;
  users!: CustomerProfile[];
  dishes!: DishProfile[];
  tags!: string[];
  orders!: OrderProfile[];

  constructor(private dataService: FirestoreDataService) {
    this.dataService.restaurantColl$.subscribe((data: RestaurantProfile[]) => {
      this.restaurant = data[0];
    });
    this.dataService.userColl$.subscribe((data: CustomerProfile[]) => {
      this.users = data;
    });
    this.dataService.dishColl$.subscribe((data: DishProfile[]) => {
      this.dishes = data;
    });
    this.dataService.tagColl$.subscribe((data: string[]) => {
      this.tags = data;
    });
    this.dataService.orderColl$.subscribe((data: OrderProfile[]) => {
      this.orders = data;
    });
  }

  filterOrderLength(status: string) {
    return this.orders.filter((item) => {
      item.status == status;
    }).length;
  }
}
