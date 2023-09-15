import {
  AfterViewInit,
  Component,
  HostListener,
  ViewChild,
  inject,
} from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DishListDataSource, DishListItem } from './dish-list-datasource';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dish-list',
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.scss'],
})
export class DishListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DishListItem>;
  dataSource = new DishListDataSource();
  dataService: FirestoreDataService = inject(FirestoreDataService);

  selected: string = '';

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'text', 'cost', 'tags', 'buttons'];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.dataService.dishColl$.subscribe((data) => {
      this.dataSource.data = data;
      this.table.dataSource = this.dataSource;
    });
    this.prepareData();
  }

  prepareData() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  routeEdit(id: string) {
    this.router.navigate(['edit'], {
      relativeTo: this.route,
      state: { id: id },
    });
  }

  @HostListener('document:click') clickOnRow() {
    this.selected = '';
  }
}
