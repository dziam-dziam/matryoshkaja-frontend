import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../../core/api/admin.service';
import { AuthService } from '../../core/api/auth.service';
import { AuthTokenService } from '../../core/api/auth-token.service';
import { PhotoService } from '../../core/api/photo.service';

@Component({
  selector: 'app-api-check',
  imports: [FormsModule, JsonPipe],
  templateUrl: './api-check.html',
  styleUrl: './api-check.css',
})
export class ApiCheck {
  private readonly authService = inject(AuthService);
  private readonly authTokenService = inject(AuthTokenService);
  private readonly photoService = inject(PhotoService);
  private readonly adminService = inject(AdminService);

  readonly token = this.authTokenService.token;
  readonly result = signal<unknown>(null);
  readonly error = signal<unknown>(null);

  loginData = {
    email: 'matryoshkaja@gmail.com',
    password: 'K@ja2002!!',
  };

  photoId = 1;
  deletePhotoId = 1;
  adminId = 1;

  newAdmin = {
    email: '',
    password: '',
  };

  selectedFile: File | null = null;

  login(): void {
    this.clearResult();

    this.authService.login(this.loginData).subscribe({
      next: (token) => this.result.set({ message: 'Zalogowano', token }),
      error: (error) => this.error.set(error),
    });
  }

  logout(): void {
    this.authService.logout();
    this.result.set({ message: 'Wylogowano' });
    this.error.set(null);
  }

  getPhotos(): void {
    this.clearResult();

    this.photoService.getAll().subscribe({
      next: (photos) => this.result.set(photos),
      error: (error) => this.error.set(error),
    });
  }

  getPhotoById(): void {
    this.clearResult();

    this.photoService.getById(this.photoId).subscribe({
      next: (photo) => this.result.set(photo),
      error: (error) => this.error.set(error),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  uploadPhoto(): void {
    this.clearResult();

    if (!this.selectedFile) {
      this.error.set({ message: 'Najpierw wybierz plik.' });
      return;
    }

    this.photoService.upload(this.selectedFile).subscribe({
      next: (photo) => this.result.set(photo),
      error: (error) => this.error.set(error),
    });
  }

  deletePhoto(): void {
    this.clearResult();

    this.photoService.delete(this.deletePhotoId).subscribe({
      next: () => this.result.set({ message: 'Zdjecie usuniete' }),
      error: (error) => this.error.set(error),
    });
  }

  getAdmins(): void {
    this.clearResult();

    this.adminService.getAll().subscribe({
      next: (admins) => this.result.set(admins),
      error: (error) => this.error.set(error),
    });
  }

  getAdminById(): void {
    this.clearResult();

    this.adminService.getById(this.adminId).subscribe({
      next: (admin) => this.result.set(admin),
      error: (error) => this.error.set(error),
    });
  }

  createAdmin(): void {
    this.clearResult();

    this.adminService.create(this.newAdmin).subscribe({
      next: (admin) => this.result.set(admin),
      error: (error) => this.error.set(error),
    });
  }

  private clearResult(): void {
    this.result.set(null);
    this.error.set(null);
  }
}