import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.html',
  imports: [CommonModule, Button],
})
export class Paginator {
  currentPage = input.required<number>();
  totalPages = input.required<number>();

  pageChange = output<number>();

  protected pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    pages.push(1);

    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (total > 1 && !pages.includes(total)) pages.push(total);

    return pages;
  });

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  shouldShowEllipsis(page: number, index: number): boolean {
    const pages = this.pages();
    return index > 0 && page - pages[index - 1] > 1;
  }
}
