import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/api/auth.service';
import { AuthTokenService } from '../../../core/api/auth-token.service';
import { PageContentResponse, PhotoResponse } from '../../../core/api/api.models';
import { PageContentService } from '../../../core/api/page-content.service';
import { PhotoService } from '../../../core/api/photo.service';
import { FooterComponent } from '../../../shared/components/footer-component/footer-component';
import { HeaderComponent } from '../../../shared/components/header-component/header-component';

// CMS TEXT: pole widoczne w admin panelu.
interface ContentField extends PageContentResponse {
  label: string;
}

@Component({
  selector: 'app-admin-panel',
  imports: [FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  private readonly authService = inject(AuthService);
  private readonly authTokenService = inject(AuthTokenService);
  private readonly pageContentService = inject(PageContentService);
  private readonly photoService = inject(PhotoService);

  readonly token = this.authTokenService.token;
  readonly isLoggedIn = computed(() => Boolean(this.token()));

  readonly photos = signal<PhotoResponse[]>([]);
  readonly loading = signal(false);
  readonly error = signal<unknown>(null);
  readonly message = signal('');

  // CMS TEXT: lista tekstów, które klientka może edytować.
  readonly contentFields = signal<ContentField[]>([
    {
      key: 'lookbook.intro',
      label: 'LookBook intro text',
      value:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus ligula sit amet est egestas condimentum. Donec volutpat a massa tincidunt consectetur.',
    },
    { key: 'about.section1.title', label: 'About section 1 title', value: 'Lorem Ipsum' },
    {
      key: 'about.section1.text',
      label: 'About section 1 text',
      value:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus ligula sit amet est egestas condimentum.',
    },
    { key: 'about.section2.title', label: 'About section 2 title', value: 'Lorem Ipsum' },
    {
      key: 'about.section2.text',
      label: 'About section 2 text',
      value:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus ligula sit amet est egestas condimentum.',
    },
    { key: 'about.section3.title', label: 'About section 3 title', value: 'Lorem Ipsum' },
    {
      key: 'about.section3.text',
      label: 'About section 3 text',
      value:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus ligula sit amet est egestas condimentum.',
    },
  ]);

  loginData = {
    email: 'matryoshkaja@gmail.com',
    password: 'K@ja2002!!',
  };

  selectedFile: File | null = null;

  constructor() {
    this.loadPhotos();
    this.loadContent();
  }

  login(): void {
    this.clearFeedback();

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.message.set('Logged in.');
        this.loadPhotos();
        this.loadContent();
      },
      error: (error) => this.error.set(error),
    });
  }

  logout(): void {
    this.authService.logout();
    this.message.set('Logged out.');
    this.error.set(null);
  }

  loadPhotos(): void {
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

  // CMS TEXT: pobiera zapisane teksty z backendu.
  loadContent(): void {
    this.pageContentService.getAll().subscribe({
      next: (content) => {
        this.contentFields.update((fields) =>
          fields.map((field) => ({
            ...field,
            value: content.find((item) => item.key === field.key)?.value ?? field.value,
          })),
        );
      },
      error: () => {},
    });
  }

  // CMS TEXT: zapisuje teksty z panelu admina.
  saveContent(): void {
    this.clearFeedback();

    this.pageContentService
      .updateAll(this.contentFields().map(({ key, value }) => ({ key, value })))
      .subscribe({
        next: () => this.message.set('Text fields saved.'),
        error: (error) => this.error.set(error),
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;

    if (this.selectedFile) {
      this.uploadPhoto();
      input.value = '';
    }
  }

  uploadPhoto(): void {
    this.clearFeedback();

    if (!this.selectedFile) {
      this.error.set({ message: 'Choose a file first.' });
      return;
    }

    this.photoService.upload(this.selectedFile).subscribe({
      next: () => {
        this.selectedFile = null;
        this.message.set('Photo uploaded.');
        this.loadPhotos();
      },
      error: (error) => this.error.set(error),
    });
  }

  deletePhoto(photoId: number): void {
    this.clearFeedback();

    this.photoService.delete(photoId).subscribe({
      next: () => {
        this.message.set(`Photo #${photoId} deleted.`);
        this.loadPhotos();
      },
      error: (error) => this.error.set(error),
    });
  }

  private clearFeedback(): void {
    this.message.set('');
    this.error.set(null);
  }
}
