import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishesOverviewComponent } from './dishes-overview.component';

describe('DishesOverviewComponent', () => {
  let component: DishesOverviewComponent;
  let fixture: ComponentFixture<DishesOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DishesOverviewComponent]
    });
    fixture = TestBed.createComponent(DishesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
