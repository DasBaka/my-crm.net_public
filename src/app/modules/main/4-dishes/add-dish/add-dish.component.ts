import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentReference, addDoc, updateDoc } from 'firebase/firestore';
import { CurrencyFormatterService } from 'src/app/core/services/currency-formatter.service';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { Dish } from 'src/models/classes/dish.class';
import { DishProfile } from 'src/models/interfaces/dish-profile.interface';

@Component({
  selector: 'app-add-dish',
  templateUrl: './add-dish.component.html',
  styleUrls: ['./add-dish.component.scss'],
})
export class AddDishComponent implements AfterViewInit {
  @ViewChild('currency') currency!: ElementRef;
  private fb = inject(FormBuilder);
  dataService: FirestoreDataService = inject(FirestoreDataService);
  tagList: string[] = [];
  currencyService: CurrencyFormatterService = inject(CurrencyFormatterService);
  dataToEdit = new Dish();
  id: string | undefined;

  dishForm!: FormGroup;

  constructor(private _snackBar: MatSnackBar) {
    this.id = window.history.state.id || undefined;
    console.log(this.id);

    this.initForm();
    this.dataService.tagColl$.subscribe((data) => {
      data.forEach((e) => {
        this.tagList.push(e.tag);
      });
    });
  }

  async ngAfterViewInit() {
    await this.getEditable();
    this.initForm();
    if (this.currency.nativeElement.value == null) {
      this.currency.nativeElement.value = this.currencyService.rtl('0.00');
    }
  }

  initForm() {
    this.dishForm = this.fb.group({
      name: [this.dataToEdit.name || null, Validators.required],
      text: [this.dataToEdit.text || null],
      cost: [this.dataToEdit.cost || '€0.00', this.priceError()],
      tags: [this.dataToEdit.tags || ''],
    });
  }

  async getEditable() {
    if (this.id) {
      this.dataToEdit = new Dish(
        (await this.dataService.getDocData('dishes/' + this.id)) as DishProfile
      );
    }
  }

  formatCurrency() {
    let current = this.currency.nativeElement;
    current.value = this.currencyService.rtl(current.value) ?? '€0.00';
    this.dishForm.controls['cost'].setValue(current.value);
  }

  priceError(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const price = parseInt(value.slice(1, value.length));
      return price < 1 ? { cost: value } : null;
    };
  }

  async onSubmit(): Promise<void> {
    if (this.dishForm.valid) {
      try {
        if (this.id) {
          await this.dataService.update(
            'dishes/' + this.id,
            this.dishForm.value
          );
        } else {
          await this.newDish();
        }
      } catch (error) {
        console.log(error);
        return;
      }
    }
  }

  async newDish() {
    await addDoc(this.dataService.coll('dishes'), this.dishForm.value).then(
      (doc: DocumentReference) => {
        let id = doc.id;
        updateDoc(doc, { id: id });
      }
    );
    let message = this.dishForm.controls['name'].value + "' added.";
    this._snackBar.open(message, 'OK', { duration: 5000 });
    this.dishForm.reset();
  }
}
