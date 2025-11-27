import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navlink',
  imports: [RouterModule],
  template: `<a [routerLink]="route.path">{{ route.label }}</a> `,
  styles: [],
})
export class Navlink {
  @Input() route!: { path: string; label: string };
}
