import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableDataSource, TableItem } from './table-datasource';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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

  @Input() restaurantsCollection$!: Observable<any[]>;

  constructor(public router: Router, private route: ActivatedRoute) {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'owner', 'contact', 'open'];

  date = new Date();
  day = this.date.getDay();

  ngAfterViewInit(): void {
    this.restaurantsCollection$.subscribe((data) => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = data;
    });
  }

  navigate(id: string) {
    this.router.navigate(['details'], {
      relativeTo: this.route,
      state: { id: id }, // https://medium.com/javascript-everyday/keep-data-in-the-state-object-during-navigation-in-angular-5657af156fb8
    });
    return false;
  }
}
