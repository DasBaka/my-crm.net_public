import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private breakpointObserver = inject(BreakpointObserver);

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver
    .observe([Breakpoints.Tablet, Breakpoints.Handset])
    .pipe(
      map(({ matches }) => {
        if (matches) {
          return [
            {
              title: 'Orders',
              icon: 'dashboard',
              link: '../orders/overview',
              cols: 4,
              rows: 1,
              text: ['Organize current orders'],
            },
            {
              title: 'Users',
              icon: 'manage_accounts',
              link: '../users',
              cols: 4,
              rows: 1,
              text: ['Edit registered users'],
            },
            {
              title: 'Dishes',
              icon: 'storefront',
              link: '../dishes/list',
              cols: 4,
              rows: 1,
              text: ['See all listed dishes and tags'],
            },
            {
              title: 'Restaurant',
              icon: 'person_play',
              link: '../restaurant/stats',
              cols: 4,
              rows: 1,
              text: ['See general statistics'],
            },
          ];
        }

        return [
          {
            title: 'Orders',
            icon: 'dashboard',
            link: '../orders/overview',
            cols: 1,
            rows: 1,
            text: ['Organize current orders'],
          },
          {
            title: 'Users',
            icon: 'manage_accounts',
            link: '../users',
            cols: 1,
            rows: 1,
            text: ['Edit reigstered users'],
          },
          {
            title: 'Dishes',
            icon: 'storefront',
            link: '../dishes/list',
            cols: 1,
            rows: 1,
            text: ['See all listed dishes and tags'],
          },
          {
            title: 'Restaurant',
            icon: 'person_play',
            link: '../restaurant/stats',
            cols: 1,
            rows: 1,
            text: ['See general statistics'],
          },
        ];
      })
    );
}
