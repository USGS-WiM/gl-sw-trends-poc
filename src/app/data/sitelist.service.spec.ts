import { TestBed } from '@angular/core/testing';

import { SitelistService } from './sitelist.service';

describe('SitelistService', () => {
  let service: SitelistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SitelistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
