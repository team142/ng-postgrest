import { TestBed, inject } from '@angular/core/testing';

import { PostgrestServiceService } from './postgrest-service.service';

describe('PostgrestServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostgrestServiceService]
    });
  });

  it('should be created', inject([PostgrestServiceService], (service: PostgrestServiceService) => {
    expect(service).toBeTruthy();
  }));
});
