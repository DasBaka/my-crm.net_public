import { Injectable } from '@angular/core';
import { FirebaseApps } from '@angular/fire/app';
import { collectionData } from '@angular/fire/firestore';
import { Firestore, collection, getFirestore } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreDataService {
  fs!: Firestore;
  dishColl$!: Observable<any[]>;
  orderColl$!: Observable<any[]>;
  restaurantColl$!: Observable<any[]>;
  tagColl$!: Observable<any[]>;

  constructor(private allFirebaseApps: FirebaseApps) {
    let app = this.findApp();
    if (app) {
      this.fs = getFirestore(app);
      this.dishColl$ = collectionData(
        collection(this.fs, 'dishes')
      ) as Observable<any[]>;
      this.orderColl$ = collectionData(
        collection(this.fs, 'orders')
      ) as Observable<any[]>;
      this.restaurantColl$ = collectionData(
        collection(this.fs, 'restaurant')
      ) as Observable<any[]>;
      this.tagColl$ = collectionData(collection(this.fs, 'tags')) as Observable<
        any[]
      >;
    }
  }

  findApp() {
    let app = this.allFirebaseApps.find((obj) => obj.name === '[DEFAULT]');
    return app;
  }

  coll(coll: string) {
    return collection(this.fs, coll);
  }

  /*
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
 */
}
