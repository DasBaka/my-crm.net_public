import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FirebaseApps } from '@angular/fire/app';
import { AuthInstances } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  getFirestore,
} from '@angular/fire/firestore';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss'],
})
export class RestaurantsComponent {
  restaurantStore!: Firestore;
  restaurantsCollection$!: Observable<any[]>;

  constructor(private allFirebaseApps: FirebaseApps) {
    let restaurantsApp = this.allFirebaseApps.find(
      (obj) => obj.name === 'clone'
    );
    if (restaurantsApp) {
      this.restaurantStore = getFirestore(restaurantsApp);
      const coll = collection(this.restaurantStore, 'restaurants');
      this.restaurantsCollection$ = collectionData(coll) as Observable<any[]>;
    }
  }
}
