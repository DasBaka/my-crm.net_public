import { Injectable } from '@angular/core';
import { FirebaseApps } from '@angular/fire/app';
import { collectionData } from '@angular/fire/firestore';
import {
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsDataService {
  restaurantStore!: Firestore;
  restaurantsCollection$!: Observable<any[]>;

  constructor(private allFirebaseApps: FirebaseApps) {
    let restaurantsApp = this.findApp();
    if (restaurantsApp) {
      this.restaurantStore = getFirestore(restaurantsApp);
      const coll = collection(this.restaurantStore, 'restaurants');
      this.restaurantsCollection$ = collectionData(coll) as Observable<any[]>;
    }
  }

  findApp() {
    let restaurantsApp = this.allFirebaseApps.find(
      (obj) => obj.name === 'clone'
    );
    return restaurantsApp;
  }

  async getRestaurantDetails(id: string) {
    const docRef = doc(this.restaurantStore, 'restaurants', id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async addNewDoc(values: any) {
    let id: string | undefined;
    const coll = collection(this.restaurantStore, 'restaurants');
    await addDoc(coll, values).then((doc: DocumentReference) => {
      id = doc.id;
      updateDoc(doc, {
        id: id,
        tags: {},
      });
    });
    this.defineNewDoc(id);
  }

  async defineNewDoc(id: string | undefined) {
    if (id != undefined) {
      await setDoc(
        doc(this.restaurantStore, 'restaurants/' + id + '/dishes', id),
        {}
      );
    }
  }

  async updateEdittedDoc(id: string, values: any) {
    let docRef = doc(this.restaurantStore, 'restaurants/' + id);
    await updateDoc(docRef, values);
  }
}
