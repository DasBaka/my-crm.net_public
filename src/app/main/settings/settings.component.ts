import { AfterViewInit, Component, Input, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantsDataService } from 'src/app/restaurants-data.service';
import { Restaurant } from 'src/models/classes/restaurant.class';
import { RestaurantProfile } from 'src/models/interfaces/restaurant-profile.interface';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements AfterViewInit {
  @Input() restaurantStore!: Firestore;
  dataService: RestaurantsDataService = inject(RestaurantsDataService);
  restaurant!: RestaurantProfile;
  dataToEdit = new Restaurant();
  id: string | undefined;

  private fb = inject(FormBuilder);
  newRestaurantForm!: FormGroup;

  constructor(public router: Router, public route: ActivatedRoute) {
    this.id = window.history.state.id;
    this.initForm();
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.id) {
      await this.getEditable(this.id);
      this.initForm();
    }
  }

  initForm() {
    this.newRestaurantForm = this.fb.group({
      responsible: this.responsibleGroup(this.dataToEdit),
      address: this.addressGroup(this.dataToEdit),
      contact: this.contactGroup(this.dataToEdit),
      hours: this.dataToEdit.hours,
    });
  }

  async getEditable(id: string) {
    this.restaurant = (await this.dataService.getRestaurantDetails(
      id
    )) as RestaurantProfile;
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
    if (this.id) {
      this.dataService
        .updateEdittedDoc(this.id, this.newRestaurantForm.value)
        .then(() => {
          this.router.navigate(['../'], {
            relativeTo: this.route,
            state: { id: this.id },
          });
        });
    } else {
      this.dataService.addNewDoc(this.newRestaurantForm.value).then(() => {
        this.router.navigate(['../'], {
          relativeTo: this.route,
        });
      });
    }
  }
}
