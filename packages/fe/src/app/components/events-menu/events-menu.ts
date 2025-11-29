import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { EVENT_CATEGORY_LABELS, EventCategory } from '@reservation-app/shared';
@Component({
  selector: 'app-events-menu',
  standalone: true,
  imports: [CommonModule],
  template: ` <div class="w-full mt-4 flex justify-center" role="tablist">
    <div class="lg:w-3/4 tabs tabs-box justify-between py-2.5 px-12">
      @for (category of categories(); track $index) {
      <input
        type="radio"
        class="tab"
        [checked]="selectedCategory() === category"
        [name]="category"
        [aria-label]="categoryLabels[category]"
        (change)="onCategorySelected(category)"
      />
      }
    </div>
  </div>`,
  styleUrl: './events-menu.css',
})
export class EventsMenu {
  categorySelected = output<EventCategory | null>();
  selectedCategory = signal<EventCategory | null>(null);
  categories = input<EventCategory[]>([]);
  protected readonly categoryLabels = EVENT_CATEGORY_LABELS;

  onCategorySelected(category: EventCategory) {
    this.selectedCategory.set(category);
    this.categorySelected.emit(category);
  }
}
