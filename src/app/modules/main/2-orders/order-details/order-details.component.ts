import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  OrderDetailsDataSource,
  OrderDetailsItem,
} from './order-details-datasource';
import { Observable, Subscription } from 'rxjs';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { CustomerProfile } from 'src/models/interfaces/customer-profile';
import {
  UserDetailsItem,
  UserDetailsDataSource,
} from '../../3-users/user-details/user-details-datasource';
import { OrderProfile } from 'src/models/interfaces/order-profile';
import { NumberInput } from '@angular/cdk/coercion';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<OrderDetailsItem>;
  dataSource = new OrderDetailsDataSource();
  dataService: FirestoreDataService = inject(FirestoreDataService);
  private oid = '';
  order!: OrderProfile;
  u = this.order?.user?.data.customer;
  address = this.order?.user?.data.address;
  contact = this.order?.user?.data.contact;
  time: string;
  pctTime: NumberInput;
  timestamp!: number;
  timer = setInterval(() => {
    if (this.timestamp) {
      let t = Date.now() - this.timestamp;
      let diff = 3600000 - t;
      if (diff > 0) {
        this.time = new Date(3600000 - t).toISOString().slice(14, 19);
        this.pctTime = parseInt((t / 36000).toFixed(2));
      } else {
        this.time =
          '+ ' +
          new Date(Date.now() - this.timestamp).toISOString().slice(11, 19);
      }
    }
  }, 1000);

  displayedColumns = ['times', 'item', 'price'];

  constructor() {
    this.time = '';
    this.oid = window.history.state.id;
  }

  async ngAfterViewInit() {
    await this.getOrderData();
    if (this.order) {
      this.dataSource.data = this.order.cart.order;
      this.table.dataSource = this.dataSource;
      this.timestamp = this.order.timestamp;
    }
    this.prepareData();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  prepareData() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  async getOrderData() {
    let data = await this.dataService.getDocData('orders/' + this.oid);
    this.order = data as OrderProfile;
    this.refineOrderData();
  }

  getDate(time: string | number) {
    let date = new Date(time);
    return date.toLocaleString('en-GB', {
      hour12: true,
      timeStyle: 'short',
      dateStyle: 'medium',
    });
  }

  refineOrderData() {
    this.u = this.order?.user?.data.customer;
    this.address = this.order?.user?.data.address;
    this.contact = this.order?.user?.data.contact;
  }
}
