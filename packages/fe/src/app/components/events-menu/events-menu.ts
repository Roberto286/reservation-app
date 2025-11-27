import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, output, signal } from '@angular/core';
import type { EventCategory } from '@reservation-app/shared';
@Component({
  selector: 'app-events-menu',
  standalone: true,
  imports: [CommonModule],
  template: ` <div class="w-full mt-4 flex justify-center" role="tablist">
    <div class="lg:w-3/4 tabs tabs-box justify-evenly py-2.5">
      @for (category of categories(); track $index) {
      <input
        type="radio"
        class="tab"
        [checked]="selectedCategory() === category"
        [name]="category"
        [aria-label]="category"
        (change)="onCategorySelected(category)"
      />
      }
    </div>
  </div>`,
  styleUrl: './events-menu.css',
})
export class EventsMenu {
  private readonly http = inject(HttpClient);
  categorySelected = output<EventCategory | null>();
  selectedCategory = signal<EventCategory | null>(null);
  categories = signal<EventCategory[]>([]);

  constructor() {
    this.http.get<EventCategory[]>('/events/categories').subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  onCategorySelected(category: EventCategory) {
    this.selectedCategory.set(category);
    this.categorySelected.emit(category);
  }
}
