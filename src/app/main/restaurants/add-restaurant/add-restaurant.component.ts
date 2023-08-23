import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
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

  openingHours = [
    {
      day: 'Monday',
      isOpen: false,
      time: { from: '4:00 PM', to: '5:00 PM' },
    },
    {
      day: 'Tuesday',
      isOpen: false,
      time: { from: '4:00 PM', to: '5:00 PM' },
    },
    {
      day: 'Wednesday',
      isOpen: false,
      time: { from: '4:00 PM', to: '5:00 PM' },
    },
    {
      day: 'Thursday',
      isOpen: false,
      time: { from: '4:00 PM', to: '5:00 PM' },
    },
    {
      day: 'Friday',
      isOpen: false,
      time: { from: '4:00 PM', to: '5:00 PM' },
    },
    {
      day: 'Saturday',
      isOpen: false,
      time: { from: '4:00 PM', to: '5:00 PM' },
    },
    {
      day: 'Sunday',
      isOpen: false,
      time: { from: '4:00 PM', to: '5:00 PM' },
    },
  ];

  private fb = inject(FormBuilder);
  newRestaurantForm = this.fb.group({
    general: this.fb.group({
      restaurant: [null, Validators.required],
      owner: [null, Validators.required],
      mail: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ]),
      ],
    }),
    address: this.fb.group({
      street: [null, Validators.required],
      house: [null, Validators.required],
      city: [null, Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('[0-9]{5,5}')]],
    }),
    hours: [this.openingHours],
    delivery: this.fb.group({
      min: [null, Validators.required],
      costs: [null, Validators.required],
    }),
    likes: [
      {
        amount: 0,
        ratio: 0,
      },
    ],
  });

  constructor() {}

  async onSubmit(): Promise<void> {
    if (this.newRestaurantForm.valid) {
      const coll = collection(this.restaurantStore, 'restaurants');
      await addDoc(coll, this.newRestaurantForm.value).then(
        (doc: DocumentReference) => {
          updateDoc(doc, {
            id: doc.id,
          });
        }
      );
    }
  }
}
