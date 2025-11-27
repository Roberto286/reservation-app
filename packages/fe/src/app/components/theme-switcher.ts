import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-theme-switcher',
  imports: [FormsModule],
  template: `<label class="swap swap-rotate">
    <input
      type="checkbox"
      class="theme-controller"
      [checked]="isDarkMode()"
      (change)="toggleTheme()"
    />

    <!-- sun icon -->
    <svg
      class="swap-off h-10 w-10 fill-current"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Sun Icon"
    >
      <use href="/icons/theme-sun.svg#theme-sun-icon"></use>
    </svg>
    <!-- moon icon -->
    <svg
      class="swap-on h-10 w-10 fill-current"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Moon Icon"
    >
      <use href="/icons/theme-moon.svg#theme-moon-icon"></use>
    </svg>
  </label>`,
  styles: [],
})
export class ThemeSwitcher {
  protected isDarkMode = signal<boolean>(true);
  theme = computed<Theme>(() => (this.isDarkMode() ? 'dark' : 'light'));

  constructor() {
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.theme());
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update((value) => !value);
  }
}
