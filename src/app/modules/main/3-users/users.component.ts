import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
} from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsersDataSource, UsersItem } from '../3-users/users-datasource';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { FormControl } from '@angular/forms';
import { DocumentReference, addDoc, updateDoc } from 'firebase/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterTableService } from 'src/app/core/services/filter-table.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dishes-overview',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<UsersItem>;
  @ViewChild('input') input!: ElementRef;
  @ViewChild('h1') h!: ElementRef;
  addingTag = new FormControl('');
  dataSource = new UsersDataSource();
  dataService: FirestoreDataService = inject(FirestoreDataService);
  filterService: FilterTableService = inject(FilterTableService);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'address', 'buttons'];
  selected: string = '';

  dblClick = false;
  timeAtClick = 0;

  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.dataService.userColl$.subscribe((data) => {
      this.dataSource.data = data;
      this.table.dataSource = this.dataSource;
    });
    this.prepareData();
  }

  prepareData() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  filter() {
    this.table.dataSource = this.dataSource;
    if (this.filterService.inputValue(this.input).length != 0) {
      this.table.dataSource = this.filtered();
    }
    this.prepareData();
  }

  filtered() {
    return this.dataSource.data.filter((item) =>
      this.filterService.isPartOfString(
        item.id,
        this.filterService.inputValue(this.input)
      )
    );
  }

  async addTag() {
    let arr: string[] = [];
    this.dataSource.data.forEach((e) => {
      arr.push(e.id);
    });
    let newTag =
      this.filterService.inputValue(this.input).charAt(0).toUpperCase() +
      this.filterService.inputValue(this.input).slice(1);
    if (!arr.includes(newTag)) {
      await this.syncWithFirebaseUsers(newTag);
      this.addingTag.reset();
    } else {
      this.addingTag.setErrors({ exists: true });
    }
  }

  async syncWithFirebaseUsers(newTag: string) {
    try {
      await addDoc(this.dataService.coll('users'), {
        usage: 0,
        tag: newTag,
      }).then((doc: DocumentReference) => {
        updateDoc(doc, {
          id: doc.id,
        });
      });
      this._snackBar.open('"' + newTag + '"-Tag added.', 'OK', {
        duration: 5000,
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }

  openUserDetails(id: string) {
    this.router.navigate(['details'], {
      relativeTo: this.route,
      state: { id: id },
    });
  }

  simulateDblClick(id: string) {
    let now = Date.now();
    if (now - this.timeAtClick < 300) {
      this.openUserDetails(id);
      return;
    }
    this.timeAtClick = now;
    return;
  }
}
