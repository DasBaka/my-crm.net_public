import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './modules/navigation/navigation.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HomeComponent } from './modules/main/1-home/home.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';
import { UsersComponent } from './modules/main/3-users/users.component';
import { OrdersComponent } from './modules/main/2-orders/orders.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ResponsibleComponent } from './modules/main/5-restaurant/responsible/responsible.component';
import { MatTreeModule } from '@angular/material/tree';
import { TagsComponent } from './modules/main/4-dishes/tags/tags.component';
import { DishListComponent } from './modules/main/4-dishes/dish-list/dish-list.component';
import { AddDishComponent } from './modules/main/4-dishes/add-dish/add-dish.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DeleteDialogComponent } from './modules/dialog/delete-dialog/delete-dialog.component';
import { AutofocusDirective } from './core/directives/autofocus.directive';
import { DeliveryHoursComponent } from './modules/main/5-restaurant/delivery-hours/delivery-hours.component';
import { UserDetailsComponent } from './modules/main/3-users/user-details/user-details.component';
import { StatsComponent } from './modules/main/5-restaurant/stats/stats.component';
import { OrderOverviewComponent } from './modules/main/2-orders/order-overview/order-overview.component';
import { OrderDetailsComponent } from './modules/main/2-orders/order-details/order-details.component';
import { LoginComponent } from './modules/login/login.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImprintComponent } from './modules/imprint/imprint.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    UsersComponent,
    OrdersComponent,
    ResponsibleComponent,
    TagsComponent,
    DishListComponent,
    AddDishComponent,
    DeleteDialogComponent,
    AutofocusDirective,
    DeliveryHoursComponent,
    UserDetailsComponent,
    StatsComponent,
    OrderOverviewComponent,
    OrderDetailsComponent,
    LoginComponent,
    ImprintComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    NgxMatTimepickerModule,
    MatExpansionModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseCrm)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    DragDropModule,
    MatTreeModule,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        enterAnimationDuration: '250ms',
        exitAnimationDuration: '250ms',
        disableClose: true,
        closeOnNavigation: true,
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
