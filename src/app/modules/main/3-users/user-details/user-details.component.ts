import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  UserDetailsDataSource,
  UserDetailsItem,
} from './user-details-datasource';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { CustomerProfile } from 'src/models/interfaces/customer-profile';
import { Observable } from 'rxjs';
import { FilterTableService } from 'src/app/core/services/filter-table.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<UserDetailsItem>;
  dataSource = new UserDetailsDataSource();
  dataService: FirestoreDataService = inject(FirestoreDataService);
  private uid = '';
  user!: (CustomerProfile & { id: string }) | null;
  u = this.user?.customer;
  address = this.user?.address;
  contact = this.user?.contact;
  displayedColumns = ['time', 'items', 'price'];
  uOrders$: Observable<any>;

  constructor() {
    this.uid = window.history.state.id;
    this.getUserData();
    this.uOrders$ = this.dataService.getUsersOrders(this.uid);
  }

  ngAfterViewInit(): void {
    this.uOrders$.subscribe((data) => {
      this.dataSource.data = data;
      this.table.dataSource = this.dataSource;
    });
    this.prepareData();
  }

  prepareData() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  async getUserData() {
    let data = await this.dataService.getDocData('users/' + this.uid);
    this.user = data as CustomerProfile & { id: string };
    this.refineUserData();
  }

  refineUserData() {
    this.u = this.user?.customer;
    this.address = this.user?.address;
    this.contact = this.user?.contact;
  }

  getDate(time: string) {
    let date = new Date(time);
    return date.toLocaleString('en-GB', {
      hour12: true,
      timeStyle: 'short',
      dateStyle: 'medium',
    });
  }
}
