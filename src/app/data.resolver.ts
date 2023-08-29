import { ResolveFn } from '@angular/router';

export const dataResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
