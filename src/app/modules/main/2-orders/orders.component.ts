import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { OrderProfile } from 'src/models/interfaces/order-profile';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnDestroy {
  saving = false;
  private allOrders: Subscription;
  dataService: FirestoreDataService = inject(FirestoreDataService);

  new: OrderProfile[] = [];

  process: OrderProfile[] = [];

  delivery: OrderProfile[] = [];

  done: OrderProfile[] = [];

  constructor() {
    this.allOrders = this.dataService.orderColl$.subscribe((data) => {
      this.new = [];
      this.process = [];
      this.delivery = [];
      this.done = [];
      data.forEach((o: OrderProfile) => {
        switch (o.status) {
          case 'new':
            this.new.push(o);
            break;
          case 'process':
            this.process.push(o);
            break;
          case 'delivery':
            this.delivery.push(o);
            break;
          case 'done':
            this.done.push(o);
            break;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.allOrders.unsubscribe();
  }

  async drop(event: CdkDragDrop<OrderProfile[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      this.saving = true;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      await this.changeStatus(
        event.container.data[0].id,
        event.container.element.nativeElement.classList
      );
    }
  }

  async changeStatus(id: string, idHelpList: DOMTokenList) {
    let statusName: string = '';
    if (idHelpList.contains('list-0')) {
      statusName = 'new';
    } else if (idHelpList.contains('list-1')) {
      statusName = 'process';
    } else if (idHelpList.contains('list-2')) {
      statusName = 'delivery';
    } else if (idHelpList.contains('list-3')) {
      statusName = 'done';
    } else {
      return;
    }
    await this.dataService
      .update('orders/' + id, { status: statusName })
      .finally(() => {
        this.saving = false;
      });
  }

  remainingTime(time: number) {
    let t = Date.now() - time;
    let diff = 3600000 - t;
    if (diff > 0) {
      return new Date(3600000 - t).toISOString().slice(14, 19);
    } else {
      return '+ ' + new Date(Date.now() - time).toISOString().slice(11, 19);
    }
  }

  getDate(time: string | number) {
    let date = new Date(time);
    return date.toLocaleString('en-GB', {
      hour12: true,
      timeStyle: 'short',
      dateStyle: 'medium',
    });
  }

  getTimePriority(time: number, state: string) {
    let t = Date.now();
    if (t - time < this.isTimeGood(state)) {
      return 'green-prio';
    } else if (t - time < this.isTimeOK(state)) {
      return 'yellow-prio';
    } else {
      return 'red-prio';
    }
  }

  isTimeGood(state: string) {
    switch (state) {
      case 'new':
        return 600000;
      case 'process':
        return 2400000;
      case 'delivery':
        return 3600000;
      default:
        return 0;
    }
  }

  isTimeOK(state: string) {
    switch (state) {
      case 'new':
        return 1200000;
      case 'process':
        return 3600000;
      case 'delivery':
        return 4800000;
      default:
        return 0;
    }
  }
}
