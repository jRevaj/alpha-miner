import { TestBed } from '@angular/core/testing';

import { AlphaMinerService } from './alpha-miner.service';

describe('AlphaMinerService', () => {
  let service: AlphaMinerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaMinerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
