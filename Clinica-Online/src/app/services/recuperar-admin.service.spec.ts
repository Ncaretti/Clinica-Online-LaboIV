import { TestBed } from '@angular/core/testing';

import { RecuperarAdminService } from './recuperar-admin.service';

describe('RecuperarAdminService', () => {
  let service: RecuperarAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecuperarAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
