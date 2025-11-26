import { FormControl } from '@angular/forms';

export type AuthenticationFormGroup = {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
};

export type AuthenticationFormValue = {
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
};
