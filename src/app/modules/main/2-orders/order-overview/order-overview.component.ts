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
import { Observable, Subscription, map, shareReplay } from 'rxjs';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { CustomerProfile } from 'src/models/interfaces/customer-profile';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-order-overview',
  templateUrl: './order-overview.component.html',
  styleUrls: ['./order-overview.component.scss'],
})
export class OrderOverviewComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<OrderOverviewItem>;
  private breakpointObserver = inject(BreakpointObserver);
  dataSource = new OrderOverviewDataSource();
  dataService: FirestoreDataService = inject(FirestoreDataService);
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.HandsetPortrait)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  mobile!: boolean;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    { def: 'status', show: true },
    { def: 'time', show: false },
    { def: 'customer', show: true },
    { def: 'items', show: false },
    { def: 'price', show: false },
    { def: 'buttons', show: true },
  ];
  private dataSub!: Subscription;

  dblClick = false;
  timeAtClick = 0;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.isHandset$.subscribe((data) => {
      this.mobile = data;
    });
  }

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

  openOrderDetails(id: string) {
    this.router.navigate(['../details'], {
      relativeTo: this.route,
      state: { id: id },
    });
  }

  simulateDblClick(id: string) {
    let now = Date.now();
    if (now - this.timeAtClick < 300) {
      this.openOrderDetails(id);
      return;
    }
    this.timeAtClick = now;
    return;
  }

  getDisplayedColumns(): string[] {
    const isMobile = this.mobile;
    return this.displayedColumns
      .filter((cd) => !isMobile || cd.show)
      .map((cd) => cd.def);
  }
}
