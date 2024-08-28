import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Article, Category } from '../../interfaces';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { ArticlesService } from '../../services/articles.service';
import { NavigationEnd, Router } from '@angular/router';
import { ReproductorComponent } from '../reproductor/reproductor.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ReproductorComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  private categoriesService = inject(CategoriesService);
  private _categories = signal<Category[] | undefined>(undefined);
  public categories = computed(() => this._categories());
  private articlesService = inject(ArticlesService);
  public loading = false;
  public firstLoading = true;
  public resultadosBusqueda: any[] = [];
  private _allCategories: Category[] = [];

  musicPlayerState = {
    playing: false,
    currentSong: '',
  };

  routeChange() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Evita que el reproductor se reinicie cuando se cambia de ruta
        if (this.musicPlayerState.playing) {
          this.musicPlayerState.playing = true;
        }
      }
    });
  }

  constructor(private router: Router) {
    this.getCategories();
    this.routeChange();
  }

  ngOnInit(): void {}

  getCategories(): void {
    this.loading = true;

    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        const categoryList = categories
          .filter((category) => category.enabled)
          .map((category) => ({
            ...category,
            subcategories: category.subcategories
              ?.filter((subcategory) => subcategory.enabled)
              .map((subcategory) => ({
                ...subcategory,
                showArticles: false,
              })),

            showSubcategories: false,
          }));

        this._categories.set(categoryList);
        this._allCategories = categoryList; // Guarda todas las categorías para búsquedas
      },
      error: () => {
        this.loading = false;
        this.firstLoading = false;
      },
      complete: () => {
        this.loading = false;
        this.firstLoading = false;
      },
    });
  }

  getArticles(
    subcategorySlug: string,
    categoryIndex: number,
    subcategoryIndex: number
  ) {
    this.articlesService.getArticlesBySubcategory(subcategorySlug).subscribe({
      next: (articles) => {
        const categories = this._categories();
        if (categories) {
          categories[categoryIndex].subcategories![subcategoryIndex].articles =
            articles;
          categories[categoryIndex].subcategories![
            subcategoryIndex
          ].showArticles = true;
          this._categories.set([...categories]);
        }
      },
      error: () => {},
      complete: () => {},
    });
  }

  toggleSubcategories(index: number): void {
    const categories = this._categories();
    if (categories) {
      categories[index].showSubcategories =
        !categories[index].showSubcategories;
      this._categories.set([...categories]);
    }
  }

  toggleArticles(categoryIndex: number, subcategoryIndex: number): void {
    const categories = this._categories();
    if (categories) {
      categories[categoryIndex].subcategories![subcategoryIndex].showArticles =
        !categories[categoryIndex].subcategories![subcategoryIndex]
          .showArticles;
      this._categories.set([...categories]);
    }
  }

  searchArticles(busqueda: string) {
    this.loading = true;
    this.articlesService.getArticles().subscribe({
      next: (articles) => {
        const filteredArticles = articles.filter(
          (article) =>
            article.title.toLowerCase().includes(busqueda.toLowerCase()) &&
            article.enabled &&
            article.published_at
        );

        // Mapea los artículos con su categoría y subcategoría
        this.resultadosBusqueda = filteredArticles.map((article) => {
          let category;
          let subcategory;

          for (let i = 0; i < this._allCategories.length; i++) {
            if (this._allCategories[i].subcategories) {
              for (
                let j = 0;
                j < this._allCategories[i].subcategories!.length;
                j++
              ) {
                this.getArticles(
                  this._allCategories[i].subcategories![j].slug,
                  i,
                  j
                );
              }
            }
          }

          for (let i = 0; i < this.categories()!.length; i++) {
            if (this.categories()![i].subcategories) {
              for (
                let j = 0;
                j < this.categories()![i].subcategories!.length;
                j++
              ) {
                if (
                  this.categories()![i].subcategories![j].slug ===
                  article.subcategories![0].slug
                ) {
                  category = this.categories()![i];
                  subcategory = this.categories()![i].subcategories![j];
                  break;
                }
              }
            }
          }

          return {
            ...article,
            category: category?.slug,
            subcategory: subcategory?.slug,
          };
        });
      },
      error: () => {
        this.loading = false;
        this.resultadosBusqueda = [];
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  searchArticlesEnter(event: KeyboardEvent, busqueda: string) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchArticles(busqueda);
    }
  }

  generateUrl(
    categorySlug: string,
    subcategorySlug?: string,
    articleSlug?: string
  ): string {
    let url = `/${categorySlug}`;
    if (subcategorySlug) {
      url += `/${subcategorySlug}`;
    }
    if (articleSlug) {
      url += `/${articleSlug}`;
    }
    return url;
  }
}
