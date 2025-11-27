import { Component } from '@angular/core';
import { EventsMenu } from '../components/events-menu/events-menu';

@Component({
  selector: 'app-dashboard',
  template: `<app-events-menu></app-events-menu>`,
  styles: [],
  imports: [EventsMenu],
})
export class Dashboard {}
