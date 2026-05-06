import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/api/auth.service';
import { AuthTokenService } from '../../../core/api/auth-token.service';
import { PageContentResponse, PhotoResponse } from '../../../core/api/api.models';
import { PageContentService } from '../../../core/api/page-content.service';
import { PhotoService } from '../../../core/api/photo.service';
import { FooterComponent } from '../../../shared/components/footer-component/footer-component';
import { HeaderComponent } from '../../../shared/components/header-component/header-component';

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
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus ligula sit amet egestas condimentum.',
    },
  ]);

  loginData = {
    email: 'matryoshkaja@gmail.com',
    password: 'K@ja2002!!',
  };

  selectedFile: File | null = null;

  // REORDER CHANGE: aktualnie przeciągane zdjęcie.
  readonly draggedPhotoId = signal<number | null>(null);

  private dragStartPhotos: PhotoResponse[] = [];
  private dropCommitted = false;

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

  // REORDER CHANGE: start przeciągania całej karty zdjęcia.
  onDragStart(photoId: number, event: DragEvent): void {
    this.draggedPhotoId.set(photoId);
    this.dragStartPhotos = [...this.photos()];
    this.dropCommitted = false;

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(photoId));

      const card = event.currentTarget as HTMLElement | null;

      if (card) {
        event.dataTransfer.setDragImage(card, card.offsetWidth / 2, 40);
      }
    }
  }

  // REORDER CHANGE: preview kolejności jeszcze przed puszczeniem zdjęcia.
  onDragOver(targetPhotoId: number, event: DragEvent): void {
    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }

    this.previewPhotoOrder(targetPhotoId);
  }

  // REORDER CHANGE: zapisuje aktualnie widoczny preview order.
  onDrop(event: DragEvent): void {
    event.preventDefault();

    if (this.draggedPhotoId() === null) {
      return;
    }

    this.dropCommitted = true;
    this.draggedPhotoId.set(null);
    this.dragStartPhotos = [];
    this.savePhotoOrder();
  }

  // REORDER CHANGE: jeśli admin puści poza galerią, wracamy do starej kolejności.
  onDragEnd(): void {
    if (!this.dropCommitted && this.dragStartPhotos.length > 0) {
      this.setPhotosWithMotion(this.dragStartPhotos);
    }

    this.draggedPhotoId.set(null);
    this.dragStartPhotos = [];
    this.dropCommitted = false;
  }

  isDragging(photoId: number): boolean {
    return this.draggedPhotoId() === photoId;
  }

  private previewPhotoOrder(targetPhotoId: number): void {
    const draggedPhotoId = this.draggedPhotoId();

    if (draggedPhotoId === null || draggedPhotoId === targetPhotoId) {
      return;
    }

    const photos = [...this.photos()];
    const draggedIndex = photos.findIndex((photo) => photo.id === draggedPhotoId);
    const targetIndex = photos.findIndex((photo) => photo.id === targetPhotoId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    const [draggedPhoto] = photos.splice(draggedIndex, 1);
    photos.splice(targetIndex, 0, draggedPhoto);

    this.setPhotosWithMotion(photos.map((photo, index) => ({ ...photo, displayOrder: index + 1 })));
  }

  private savePhotoOrder(): void {
    this.clearFeedback();

    this.photoService.updateOrder({ photoIds: this.photos().map((photo) => photo.id) }).subscribe({
      next: (photos) => {
        this.photos.set(photos);
        this.message.set('Photo order saved.');
      },
      error: (error) => this.error.set(error),
    });
  }

  private setPhotosWithMotion(photos: PhotoResponse[]): void {
    const documentWithViewTransitions =
      typeof document === 'undefined'
        ? null
        : (document as Document & {
            startViewTransition?: (update: () => void) => void;
          });

    if (documentWithViewTransitions?.startViewTransition) {
      documentWithViewTransitions.startViewTransition(() => this.photos.set(photos));
      return;
    }

    this.photos.set(photos);
  }

  private clearFeedback(): void {
    this.message.set('');
    this.error.set(null);
  }
}
