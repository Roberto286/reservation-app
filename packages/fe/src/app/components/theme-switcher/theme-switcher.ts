import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-theme-switcher',
  imports: [FormsModule],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.css',
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
