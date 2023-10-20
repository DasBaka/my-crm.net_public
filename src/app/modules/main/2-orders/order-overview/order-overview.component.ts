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
  OrderOverviewDataSource,
  OrderOverviewItem,
} from './order-overview-datasource';
import { Subscription } from 'rxjs';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { CustomerProfile } from 'src/models/interfaces/customer-profile';

@Component({
  selector: 'app-order-overview',
  templateUrl: './order-overview.component.html',
  styleUrls: ['./order-overview.component.scss'],
})
export class OrderOverviewComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<OrderOverviewItem>;
  dataSource = new OrderOverviewDataSource();
  dataService: FirestoreDataService = inject(FirestoreDataService);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['status', 'time', 'customer', 'items', 'price'];
  private dataSub!: Subscription;

  constructor() {}

  ngAfterViewInit(): void {
    this.dataSub = this.dataService.orderColl$.subscribe((data) => {
      this.dataSource.data = data;
      this.table.dataSource = this.dataSource;
    });
    this.prepareData();
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
  }

  prepareData() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getDate(time: string) {
    let date = new Date(time);
    return new Intl.DateTimeFormat('en-GB', {
      hour12: true,
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  }
}
