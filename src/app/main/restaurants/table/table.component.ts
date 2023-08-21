import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableDataSource, TableItem } from './table-datasource';
import { FirebaseApp, FirebaseApps, getApp } from '@angular/fire/app';
import {
  Firestore,
  collection,
  collectionData,
  getFirestore,
} from '@angular/fire/firestore';
import { Auth, AuthInstances } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableItem>;
  dataSource = new TableDataSource();

  restaurantStore!: Firestore;
  restaurantsCollection$!: Observable<any[]>;

  constructor(
    private crmFirestore: FirebaseApp,
    private allFirebaseApps: FirebaseApps,
    private crmAuth: Auth,
    private authInstances: AuthInstances
  ) {
    let restaurantsApp = this.allFirebaseApps.find(
      (obj) => obj.name === 'clone'
    );
    if (restaurantsApp) {
      this.restaurantStore = getFirestore(restaurantsApp);
      const coll = collection(this.restaurantStore, 'restaurants');
      this.restaurantsCollection$ = collectionData(coll) as Observable<any[]>;
    }
  }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngAfterViewInit(): void {
    this.restaurantsCollection$.subscribe((data) => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = data;
    });
  }
}
