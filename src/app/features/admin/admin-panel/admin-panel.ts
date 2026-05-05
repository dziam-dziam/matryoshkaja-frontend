import { JsonPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/api/auth.service';
import { AuthTokenService } from '../../../core/api/auth-token.service';
import { PhotoResponse } from '../../../core/api/api.models';
import { PhotoService } from '../../../core/api/photo.service';
import { FooterComponent } from '../../../shared/components/footer-component/footer-component';
import { HeaderComponent } from '../../../shared/components/header-component/header-component';

@Component({
  selector: 'app-admin-panel',
  imports: [FormsModule, JsonPipe, HeaderComponent, FooterComponent],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  private readonly authService = inject(AuthService);
  private readonly authTokenService = inject(AuthTokenService);
  private readonly photoService = inject(PhotoService);

  readonly token = this.authTokenService.token;
  readonly isLoggedIn = computed(() => Boolean(this.token()));

  readonly photos = signal<PhotoResponse[]>([]);
  readonly loading = signal(false);
  readonly error = signal<unknown>(null);
  readonly message = signal('');

  loginData = {
    email: 'matryoshkaja@gmail.com',
    password: 'K@ja2002!!',
  };

  selectedFile: File | null = null;

  constructor() {
    this.loadPhotos();
  }

  login(): void {
    this.clearFeedback();

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.message.set('Logged in.');
        this.loadPhotos();
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
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
