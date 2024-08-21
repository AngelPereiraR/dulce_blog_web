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
      map((articles) => {
        return articles;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  getArticle(id: string): Observable<Article> {
    const url = `${this.baseUrl}/articles/${id}`;

    return this.http.get<Article>(url).pipe(
      map((article) => {
        return article;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  getArticlesBySubcategory(subcategorySlug: string): Observable<Article[]> {
    const url = `${this.baseUrl}/articles?subcategorySlug=${subcategorySlug}`;

    return this.http.get<Article[]>(url).pipe(
      map((articles) => articles),
      catchError((err) => throwError(() => err.error.message))
    );
  }
}
