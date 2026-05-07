import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { PhotoCaptionUpdateRequest, PhotoOrderUpdateRequest, PhotoResponse } from './api.models';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getAll(): Observable<PhotoResponse[]> {
    return this.http.get<PhotoResponse[]>(`${this.apiBaseUrl}/photos`);
  }

  getById(photoId: number): Observable<PhotoResponse> {
    return this.http.get<PhotoResponse>(`${this.apiBaseUrl}/photos/${photoId}`);
  }

  upload(file: File, caption = ''): Observable<PhotoResponse> {
    const formData = new FormData();
    formData.append('file', file);
    // CAPTION CHANGE: caption is saved at the same time as the uploaded image.
    formData.append('caption', caption);

    return this.http.post<PhotoResponse>(`${this.apiBaseUrl}/photos`, formData);
  }

  delete(photoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/photos/${photoId}`);
  }

  // REORDER CHANGE: persists the admin-selected photo order.
  updateOrder(request: PhotoOrderUpdateRequest): Observable<PhotoResponse[]> {
    return this.http.put<PhotoResponse[]>(`${this.apiBaseUrl}/photos/order`, request);
  }

  // CAPTION CHANGE: lets admin update the caption after the photo already exists.
  updateCaption(photoId: number, request: PhotoCaptionUpdateRequest): Observable<PhotoResponse> {
    return this.http.patch<PhotoResponse>(`${this.apiBaseUrl}/photos/${photoId}/caption`, request);
  }
}
