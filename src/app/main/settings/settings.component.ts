import { AfterViewInit, Component, inject } from '@angular/core';
import {
  DocumentReference,
  doc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreDataService } from 'src/app/firestore-data.service';
import { Restaurant } from 'src/models/classes/restaurant.class';
import { RestaurantProfile } from 'src/models/interfaces/restaurant-profile.interface';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements AfterViewInit {
  dataService: FirestoreDataService = inject(FirestoreDataService);
  restaurant!: RestaurantProfile;
  docRef!: DocumentReference;
  dataToEdit = new Restaurant();

  private fb = inject(FormBuilder);
  newRestaurantForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  async ngAfterViewInit(): Promise<void> {
    await this.getEditable();
    this.initForm();
  }

  initForm() {
    this.newRestaurantForm = this.fb.group({
      responsible: this.responsibleGroup(this.dataToEdit),
      address: this.addressGroup(this.dataToEdit),
      contact: this.contactGroup(this.dataToEdit),
      hours: this.dataToEdit.hours,
    });
  }

  async getEditable() {
    this.restaurant = (await this.getRestaurantDetails()) as RestaurantProfile;
    console.log(this.restaurant);

    this.dataToEdit = new Restaurant(this.restaurant);
  }

  responsibleGroup(data: Restaurant) {
    return this.fb.group({
      firstname: [data.responsible.firstname, Validators.required],
      lastname: [data.responsible.lastname, Validators.required],
    });
  }

  addressGroup(data: Restaurant) {
    return this.fb.group({
      street: [data.address.street, Validators.required],
      house: [data.address.house, Validators.required],
      city: [data.address.city, Validators.required],
      postalCode: [
        data.address.postalCode,
        [Validators.required, Validators.pattern('[0-9]{5,5}')],
      ],
    });
  }

  contactGroup(data: Restaurant) {
    return this.fb.group({
      mail: [
        data.contact.mail,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ]),
      ],
      phone: [
        data.contact.phone,
        Validators.compose([Validators.required, Validators.pattern('[0-9]*')]),
      ],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.newRestaurantForm.valid) {
      await updateDoc(this.docRef, this.newRestaurantForm.value);
      console.log('updated');
    }
  }

  async getRestaurantDetails() {
    this.docRef = doc(this.dataService.fs, 'restaurant/restaurant-data');
    try {
      const docSnap = await getDoc(this.docRef);
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
}
