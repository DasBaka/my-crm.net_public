import { TestBed } from '@angular/core/testing';

import { RestaurantsDataService } from './restaurants-data.service';

describe('RestaurantsDataService', () => {
  let service: RestaurantsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
