import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

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

interface CaptionSaveSuccess {
  photoId: number;
  caption: string;
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
  readonly uploadingPhoto = signal(false);
  readonly savingCaptionPhotoId = signal<number | null>(null);
  readonly captionSaveSuccess = signal<CaptionSaveSuccess | null>(null);
  readonly trashHover = signal(false);
  readonly deletingPhotoId = signal<number | null>(null);
  readonly deleteSuccess = signal(false);
  readonly contentSaveSuccess = signal(false);
  private captionSuccessTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private deleteSuccessTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private contentSuccessTimeoutId: ReturnType<typeof setTimeout> | null = null;

  // CMS TEXT: lista tekstow, ktore klientka moze edytowac.
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
    password: '',
  };

  selectedFile: File | null = null;

  // CAPTION CHANGE: caption used when uploading a new photo.
  newPhotoCaption = '';

  // REORDER CHANGE: remembers which photo is currently being dragged.
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
        next: () => {
          this.message.set('Text fields saved.');
          this.showContentSuccess();
        },
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

    this.uploadingPhoto.set(true);

    this.photoService
      .upload(this.selectedFile, this.newPhotoCaption)
      .pipe(finalize(() => this.uploadingPhoto.set(false)))
      .subscribe({
        next: () => {
          this.selectedFile = null;
          // CAPTION CHANGE: clear upload caption after successful upload.
          this.newPhotoCaption = '';
          this.message.set('Photo uploaded successfully.');
          this.loadPhotos();
        },
        error: (error) => this.error.set(error),
      });
  }

  // CAPTION CHANGE: saves an edited caption for an existing photo.
  updateCaption(photo: PhotoResponse): void {
    if (this.savingCaptionPhotoId() === photo.id) {
      return;
    }

    this.clearFeedback();

    this.savingCaptionPhotoId.set(photo.id);

    this.photoService
      .updateCaption(photo.id, { caption: photo.caption ?? '' })
      .pipe(finalize(() => this.savingCaptionPhotoId.set(null)))
      .subscribe({
        next: (updatedPhoto) => {
          this.photos.update((photos) =>
            photos.map((item) => (item.id === updatedPhoto.id ? updatedPhoto : item)),
          );
          this.message.set(`Caption for photo #${photo.id} saved successfully.`);
          this.showCaptionSuccess(updatedPhoto);
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

  // REORDER CHANGE: starts native drag/drop for a photo card.
  onDragStart(photoId: number, event: DragEvent): void {
    this.draggedPhotoId.set(photoId);
    this.dragStartPhotos = [...this.photos()];
    this.dropCommitted = false;
    this.trashHover.set(false);

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(photoId));

      const card = event.currentTarget as HTMLElement | null;

      if (card) {
        event.dataTransfer.setDragImage(card, card.offsetWidth / 2, 40);
      }
    }
  }

  // REORDER CHANGE: previews the new order before the admin drops the photo.
  onDragOver(targetPhotoId: number, event: DragEvent): void {
    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }

    this.previewPhotoOrder(targetPhotoId);
  }

  // REORDER CHANGE: saves the currently previewed order.
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

  onTrashDragOver(event: DragEvent): void {
    event.preventDefault();
    this.trashHover.set(true);

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onTrashDragLeave(): void {
    this.trashHover.set(false);
  }

  onTrashDrop(event: DragEvent): void {
    event.preventDefault();

    const photoId = this.draggedPhotoId();

    if (photoId === null) {
      return;
    }

    this.dropCommitted = true;
    this.draggedPhotoId.set(null);
    this.trashHover.set(false);
    this.deletePhotoFromTrash(photoId);
  }

  // REORDER CHANGE: restores old order when the admin cancels by dropping outside the grid.
  onDragEnd(): void {
    if (!this.dropCommitted && this.dragStartPhotos.length > 0) {
      this.setPhotosWithMotion(this.dragStartPhotos);
    }

    this.draggedPhotoId.set(null);
    this.dragStartPhotos = [];
    this.dropCommitted = false;
    this.trashHover.set(false);
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

  // REORDER CHANGE: sends the new id order to backend.
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

  private deletePhotoFromTrash(photoId: number): void {
    this.clearFeedback();
    this.deletingPhotoId.set(photoId);

    this.photoService
      .delete(photoId)
      .pipe(finalize(() => this.deletingPhotoId.set(null)))
      .subscribe({
        next: () => {
          this.photos.update((photos) => photos.filter((photo) => photo.id !== photoId));
          this.dragStartPhotos = [];
          this.message.set(`Photo #${photoId} deleted.`);
          this.showDeleteSuccess();
        },
        error: (error) => {
          this.error.set(error);

          if (this.dragStartPhotos.length > 0) {
            this.setPhotosWithMotion(this.dragStartPhotos);
          }

          this.dragStartPhotos = [];
        },
      });
  }

  private setPhotosWithMotion(photos: PhotoResponse[]): void {
    const documentWithViewTransitions = typeof document === 'undefined'
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

  private showCaptionSuccess(photo: PhotoResponse): void {
    if (this.captionSuccessTimeoutId) {
      clearTimeout(this.captionSuccessTimeoutId);
    }

    this.captionSaveSuccess.set({
      photoId: photo.id,
      caption: photo.caption?.trim() || `Photo #${photo.id}`,
    });

    this.captionSuccessTimeoutId = setTimeout(() => {
      this.captionSaveSuccess.set(null);
      this.captionSuccessTimeoutId = null;
    }, 800);
  }

  private showDeleteSuccess(): void {
    if (this.deleteSuccessTimeoutId) {
      clearTimeout(this.deleteSuccessTimeoutId);
    }

    this.deleteSuccess.set(true);

    this.deleteSuccessTimeoutId = setTimeout(() => {
      this.deleteSuccess.set(false);
      this.deleteSuccessTimeoutId = null;
    }, 1800);
  }

  private showContentSuccess(): void {
    if (this.contentSuccessTimeoutId) {
      clearTimeout(this.contentSuccessTimeoutId);
    }

    this.contentSaveSuccess.set(true);

    this.contentSuccessTimeoutId = setTimeout(() => {
      this.contentSaveSuccess.set(false);
      this.contentSuccessTimeoutId = null;
    }, 800);
  }

  private clearFeedback(): void {
    this.message.set('');
    this.error.set(null);
  }
}
