import { Component, Input, inject } from '@angular/core';
import {
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';

import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.scss'],
})
export class AddRestaurantComponent {
  @Input() restaurantStore!: Firestore;

  private fb = inject(FormBuilder);
  newRestaurantForm = this.fb.group({
    restaurant: [null, Validators.required],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    address: [null, Validators.required],
    city: [null, Validators.required],
    postalCode: [
      null,
      Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
      ]),
    ],
  });

  hasUnitNumber = false;

  async onSubmit(): Promise<void> {
    if (this.newRestaurantForm.valid) {
      const coll = collection(this.restaurantStore, 'restaurants');
      await addDoc(coll, this.newRestaurantForm.value).then(
        (doc: DocumentReference) => {
          updateDoc(doc, this.additionalData(doc));
        }
      );
    }
  }

  additionalData(doc: DocumentReference) {
    return {
      id: doc.id,
      costs: '',
      likes: {
        amount: 0,
        ratio: 0,
      },
      min: '',
      time: '',
    };
  }
}
