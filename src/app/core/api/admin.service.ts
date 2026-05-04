import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { AdminCreateRequest, AdminResponse } from './api.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  create(request: AdminCreateRequest): Observable<AdminResponse> {
    return this.http.post<AdminResponse>(`${this.apiBaseUrl}/admins/create`, request);
  }

  getById(adminId: number): Observable<AdminResponse> {
    return this.http.get<AdminResponse>(`${this.apiBaseUrl}/admins/get/${adminId}`);
  }

  getAll(): Observable<AdminResponse[]> {
    return this.http.get<AdminResponse[]>(`${this.apiBaseUrl}/admins/get_all`);
  }
}
