import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environments } from '../environments/environments.prod';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Article } from '../interfaces/article';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private readonly baseUrl: string = environments.baseUrl;
  private http = inject(HttpClient);

  private _currentPage = signal<string | null>(null);
  public currentPage = computed(() => this._currentPage());

  setPage(page: string) {
    this._currentPage.set(page);
  }

  getArticles(): Observable<Article[]> {
    const url = `${this.baseUrl}/articles`;

    return this.http.get<Article[]>(url).pipe(
      map((categorys) => {
        return categorys;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  getArticle(id: string): Observable<Article> {
    const url = `${this.baseUrl}/articles/${id}`;

    return this.http.get<Article>(url).pipe(
      map((category) => {
        return category;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }
}
