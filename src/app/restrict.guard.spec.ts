import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { restrictGuard } from './restrict.guard';

describe('restrictGuard', () => {
  // const executeGuard: CanActivateFn = (...guardParameters) => 
  //     TestBed.runInInjectionContext(() => restrictGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  // it('should be created', () => {
  //   expect(executeGuard).toBeTruthy();
  // });
});
