import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent {
  private breakpointObserver = inject(BreakpointObserver);

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          {
            title: 'Card 1',
            cols: 1,
            rows: 1,
            outlet: '',
          },
          { title: 'Card 2', cols: 1, rows: 2, outlet: 'tags-list' },
          { title: 'Card 3', cols: 1, rows: 1, outlet: '' },
        ];
      }

      return [
        {
          title: 'Card 1',
          cols: 2,
          rows: 1,
          outlet: '',
        },
        { title: 'Card 2', cols: 1, rows: 2, outlet: 'tags-list' },
        { title: 'Card 3', cols: 1, rows: 1, outlet: '' },
      ];
    })
  );
}
