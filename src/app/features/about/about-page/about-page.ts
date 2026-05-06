import { Component, inject, signal } from '@angular/core';

import { PageContentService } from '../../../core/api/page-content.service';
import { FooterComponent } from '../../../shared/components/footer-component/footer-component';
import { HeaderComponent } from '../../../shared/components/header-component/header-component';

@Component({
  selector: 'app-about-page',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css',
})
export class AboutPage {
  private readonly pageContentService = inject(PageContentService);

  // CMS TEXT: fallbacki dla About Me.
  readonly content = signal<Record<string, string>>({
    'about.section1.title': 'Lorem Ipsum',
    'about.section1.text':
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus ligula sit amet est egestas condimentum.',
    'about.section2.title': 'Lorem Ipsum',
    'about.section2.text':
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus ligula sit amet est egestas condimentum.',
    'about.section3.title': 'Lorem Ipsum',
    'about.section3.text':
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus ligula sit amet est egestas condimentum.',
  });

  constructor() {
    this.pageContentService.getAll().subscribe({
      next: (items) => {
        this.content.update((current) => ({
          ...current,
          ...Object.fromEntries(items.map((item) => [item.key, item.value])),
        }));
      },
      error: () => {},
    });
  }

  text(key: string): string {
    return this.content()[key] ?? '';
  }
}
