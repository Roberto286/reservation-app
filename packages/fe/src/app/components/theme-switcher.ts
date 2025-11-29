import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Theme = 'lemonade' | 'sunset';

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
  private readonly THEME_STORAGE_KEY = 'theme';
  protected isDarkMode = signal<boolean>(this.loadThemePreference());
  theme = computed<Theme>(() => (this.isDarkMode() ? 'sunset' : 'lemonade'));

  constructor() {
    effect(() => {
      const currentTheme = this.theme();
      document.documentElement.setAttribute('data-theme', currentTheme);
      this.saveThemePreference(currentTheme);
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update((value) => !value);
  }

  private loadThemePreference(): boolean {
    if (typeof localStorage === 'undefined') {
      return true; // default to dark mode
    }
    const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY);
    return savedTheme === 'sunset' || savedTheme === null; // default to dark mode if not set
  }

  private saveThemePreference(theme: Theme): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    }
  }
}
