import { Component, inject, signal } from '@angular/core';

import { PageContentService } from '../../../core/api/page-content.service';
import { FooterComponent } from '../../../shared/components/footer-component/footer-component';
import { HeaderComponent } from '../../../shared/components/header-component/header-component';
import { PhotoListComponent } from '../photo-list-component/photo-list-component';
import { PhotoResponse } from '../../../core/api/api.models';
import { PhotoService } from '../../../core/api/photo.service';

@Component({
  selector: 'app-lookbook',
  imports: [HeaderComponent, PhotoListComponent, FooterComponent],
  templateUrl: './lookbook-page.html',
  styleUrl: './lookbook-page.css',
})
export class Lookbook {
  private readonly photoService = inject(PhotoService);
  private readonly pageContentService = inject(PageContentService);

  readonly photos = signal<PhotoResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal<unknown>(null);

  // CMS TEXT: fallback, gdy backend nie ma jeszcze zapisanego tekstu.
  readonly introText = signal(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus ligula sit amet est egestas condimentum. Donec volutpat a massa tincidunt consectetur.',
  );

  constructor() {
    this.loadPhotos();
    this.loadContent();
  }

  private loadPhotos(): void {
    this.loading.set(true);
    this.error.set(null);

    this.photoService.getAll().subscribe({
      next: (photos) => {
        this.photos.set(photos);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error);
        this.loading.set(false);
      },
    });
  }

  // CMS TEXT: pobiera tekst LookBook intro.
  private loadContent(): void {
    this.pageContentService.getAll().subscribe({
      next: (content) => {
        const intro = content.find((item) => item.key === 'lookbook.intro')?.value;

        if (intro) {
          this.introText.set(intro);
        }
      },
      error: () => {},
    });
  }
}
