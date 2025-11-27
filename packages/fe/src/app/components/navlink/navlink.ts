import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navlink',
  imports: [RouterModule],
  templateUrl: './navlink.html',
  styleUrl: './navlink.css',
})
export class Navlink {
  @Input() route!: { path: string; label: string };
}
