import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DishListDataSource, DishListItem } from './dish-list-datasource';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DishProfile } from 'src/models/interfaces/dish-profile.interface';
import { FilterTableService } from 'src/app/core/services/filter-table.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/modules/dialog/delete-dialog/delete-dialog.component';
import { Observable, Subscription, map, shareReplay } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-dish-list',
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.scss'],
})
export class DishListComponent implements AfterViewInit, OnDestroy {
  private authService = inject(AuthService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DishListItem>;
  @ViewChild('input') input!: ElementRef;
  dataSource = new DishListDataSource();
  dataService: FirestoreDataService = inject(FirestoreDataService);
  private dataSub!: Subscription;
  filterService: FilterTableService = inject(FilterTableService);

  selected: string = '';
  del = false;
  anonymous: boolean;

  private breakpointObserver = inject(BreakpointObserver);
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.HandsetPortrait)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  mobile!: boolean;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    { def: 'name', show: true },
    { def: 'text', show: false },
    { def: 'cost', show: true },
    { def: 'tags', show: false },
    { def: 'buttons', show: true },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.anonymous = this.authService.anynonimous;
    this.isHandset$.subscribe((data) => {
      this.mobile = data;
    });
  }

  ngAfterViewInit(): void {
    this.dataSub = this.dataService.dishColl$.subscribe((data) => {
      this.dataSource.data = data;
      this.prepareData();
      this.table.dataSource = this.dataSource.connect();
    });
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
  }

  prepareData() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.length = this.dataSource.data?.length | 0;
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

  filter() {
    this.table.dataSource = this.dataSource;
    if (this.filterService.inputValue(this.input).length != 0) {
      this.table.dataSource = this.filtered();
    }
    this.prepareData();
  }

  filtered() {
    return this.dataSource.data.filter((item: {}) => {
      let a: boolean[] = [];
      let v: string = this.filterService.inputValue(this.input);
      let dp = item as DishProfile;
      let { id, ...rest } = dp;

      Object.values(rest).forEach((s) => {
        if (typeof s == 'object') {
          s?.forEach((o) => {
            a.push(this.filterService.isPartOfString(o, v));
          });
        } else {
          a.push(this.filterService.isPartOfString(s, v));
        }
      });

      return a.some((value) => {
        return value;
      });
    });
  }

  openDeletionDialog(name: string, type: string, id: string) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { name: name, type: type, id: id },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.del = false;
      this.table.renderRows();
    });
  }

  getDisplayedColumns(): string[] {
    const isMobile = this.mobile;
    return this.displayedColumns
      .filter((cd) => !isMobile || cd.show)
      .map((cd) => cd.def);
  }
}
