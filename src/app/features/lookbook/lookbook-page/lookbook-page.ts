import { Component, inject, signal } from '@angular/core';

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

  readonly photos = signal<PhotoResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal<unknown>(null);

  constructor() {
    this.loadPhotos();
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
}
