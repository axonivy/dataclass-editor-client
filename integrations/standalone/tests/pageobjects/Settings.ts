import type { Page } from '@playwright/test';
import { Button } from './Button';
import { Theme } from './Theme';

export class Settings {
  readonly button: Button;
  readonly theme: Theme;

  constructor(page: Page) {
    this.button = new Button(page, { name: 'Settings' });
    this.theme = new Theme(page);
  }
}
