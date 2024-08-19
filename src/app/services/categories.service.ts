import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environments } from '../environments/environments.prod';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Category } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly baseUrl: string = environments.baseUrl;
  private http = inject(HttpClient);

  private _currentPage = signal<string | null>(null);
  public currentPage = computed(() => this._currentPage());

  setPage(page: string) {
    this._currentPage.set(page);
  }

  getCategories(): Observable<Category[]> {
    const url = `${this.baseUrl}/categories`;

    return this.http.get<Category[]>(url).pipe(
      map((categories) => {
        return categories;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  getCategory(id: string): Observable<Category> {
    const url = `${this.baseUrl}/categories/${id}`;

    return this.http.get<Category>(url).pipe(
      map((category) => {
        return category;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }
}
