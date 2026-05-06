import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { PageContentResponse } from './api.models';

// CMS TEXT: pobieranie i zapisywanie tekstów strony.
@Injectable({ providedIn: 'root' })
export class PageContentService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getAll(): Observable<PageContentResponse[]> {
    return this.http.get<PageContentResponse[]>(`${this.apiBaseUrl}/page-content`);
  }

  updateAll(content: PageContentResponse[]): Observable<PageContentResponse[]> {
    return this.http.put<PageContentResponse[]>(`${this.apiBaseUrl}/page-content`, content);
  }
}
