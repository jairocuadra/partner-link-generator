import { TestBed } from '@angular/core/testing';

import { PartnerLinkService } from './partner-link.service';

describe('PartnerLinkService', () => {
  let service: PartnerLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
