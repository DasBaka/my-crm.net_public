import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  DishesOverviewDataSource,
  DishesOverviewItem,
} from './dishes-overview-datasource';
import { FirestoreDataService } from 'src/app/firestore-data.service';
import { FormControl } from '@angular/forms';
import { addDoc } from 'firebase/firestore';

@Component({
  selector: 'app-dishes-overview',
  templateUrl: './dishes-overview.component.html',
  styleUrls: ['./dishes-overview.component.scss'],
})
export class DishesOverviewComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DishesOverviewItem>;
  @ViewChild('input') input!: ElementRef;
  addingTag = new FormControl('');
  dataSource = new DishesOverviewDataSource();
  dataService: FirestoreDataService = inject(FirestoreDataService);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['tag'];
  icon = 'add';

  ngAfterViewInit(): void {
    this.dataService.tagColl$.subscribe((data) => {
      this.dataSource.data = data;
      this.table.dataSource = this.dataSource;
    });
    this.prepareData();
    console.log(this.icon);
  }

  prepareData() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  filter() {
    this.table.dataSource = this.dataSource;
    if (this.inputValue().length != 0) {
      this.table.dataSource = this.filtered();
    }
    this.prepareData();
  }

  filtered() {
    return this.dataSource.data.filter((item) =>
      this.isPartOfString(item.tag, this.inputValue())
    );
  }

  inputValue() {
    return this.input.nativeElement.value
      .replace(/^\s+|\s+$/g, '')
      .toLowerCase();
  }

  isPartOfString(base: string, compare: string) {
    return base.toLowerCase().search(compare) != -1;
  }

  async addTag() {
    let arr: string[] = [];
    this.dataSource.data.forEach((e) => {
      arr.push(e.tag);
    });
    let newTag =
      this.inputValue().charAt(0).toUpperCase() + this.inputValue().slice(1);
    if (!arr.includes(newTag)) {
      await addDoc(this.dataService.coll('tags'), {
        count: 0,
        tag: newTag,
      });
      this.icon = 'done';
    } else {
      this.addingTag.setErrors({ exists: true });
    }
  }
}
