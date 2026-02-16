import { TestBed } from '@angular/core/testing';

import { Trainview } from './trainview';

describe('Trainview', () => {
  let service: Trainview;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Trainview);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
