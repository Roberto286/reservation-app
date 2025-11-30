import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { EVENT_CATEGORY_LABELS, EventCategory } from '@reservation-app/shared';
@Component({
  selector: 'app-events-menu',
  standalone: true,
  imports: [CommonModule],
  template: ` <div class="w-full mt-4 flex justify-center" role="tablist">
    <div class="lg:w-3/4 tabs tabs-box justify-between py-2.5 px-18">
      <input
        type="radio"
        class="tab"
        [checked]="selectedCategory() === null"
        name="category-filter"
        aria-label="Tutti"
        (change)="onShowAll()"
      />
      <div class="divider divider-horizontal hidden lg:flex"></div>
      @for (category of categories(); track $index) {
      <input
        type="radio"
        class="tab"
        [checked]="selectedCategory() === category"
        name="category-filter"
        [aria-label]="categoryLabels[category]"
        (change)="onCategorySelected(category)"
      />
      @if (category !== categories().at(-1)) {
      <div class="divider divider-horizontal hidden lg:flex"></div>
      } }
    </div>
  </div>`,
  styles: [],
})
export class EventsMenu {
  categorySelected = output<EventCategory | null>();
  selectedCategory = signal<EventCategory | null>(null);
  categories = input<EventCategory[]>([]);
  protected readonly categoryLabels = EVENT_CATEGORY_LABELS;

  onShowAll() {
    this.selectedCategory.set(null);
    this.categorySelected.emit(null);
  }

  onCategorySelected(category: EventCategory) {
    this.selectedCategory.set(category);
    this.categorySelected.emit(category);
  }
}
