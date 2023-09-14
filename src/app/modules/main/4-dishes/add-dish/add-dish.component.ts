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
import { addDoc } from 'firebase/firestore';
import { CurrencyFormatterService } from 'src/app/core/currency-formatter.service';
import { FirestoreDataService } from 'src/app/core/firestore-data.service';

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

  dishForm!: FormGroup;

  constructor(private _snackBar: MatSnackBar) {
    this.initForm();
    this.dataService.tagColl$.subscribe((data) => {
      data.forEach((e) => {
        this.tagList.push(e.tag);
      });
    });
  }

  ngAfterViewInit() {
    this.currency.nativeElement.value = this.currencyService.rtl('0.00');
  }

  initForm() {
    this.dishForm = this.fb.group({
      name: [null, Validators.required],
      text: [null],
      cost: ['€0.00', this.priceError()],
      tags: [''],
    });
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
        await addDoc(this.dataService.coll('dishes'), this.dishForm.value);
        let message = this.dishForm.controls['name'].value + "' added.";
        this._snackBar.open(message, 'OK', { duration: 5000 });
        this.dishForm.reset();
      } catch (error) {
        console.log(error);
        return;
      }
    }
  }
}
