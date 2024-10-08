import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environments } from '../environments/environments.prod';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Subcategory } from '../interfaces/subcategory';

@Injectable({
  providedIn: 'root',
})
export class SubcategoriesService {
  private readonly baseUrl: string = environments.baseUrl;
  private http = inject(HttpClient);

  private _currentPage = signal<string | null>(null);
  public currentPage = computed(() => this._currentPage());

  setPage(page: string) {
    this._currentPage.set(page);
  }

  getSubcategories(): Observable<Subcategory[]> {
    const url = `${this.baseUrl}/subcategories`;

    return this.http.get<Subcategory[]>(url).pipe(
      map((subcategories) => {
        return subcategories;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  getSubcategory(id: string): Observable<Subcategory> {
    const url = `${this.baseUrl}/subcategories/${id}`;

    return this.http.get<Subcategory>(url).pipe(
      map((subcategory) => {
        return subcategory;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }
}
