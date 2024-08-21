import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Category, Subcategory } from '../../interfaces';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { ArticlesService } from '../../services/articles.service';
import { SubcategoriesService } from '../../services/subcategories.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  private categoriesService = inject(CategoriesService);
  private _categories = signal<Category[] | undefined>(undefined);
  public categories = computed(() => this._categories());
  private articlesService = inject(ArticlesService);
  private subcategoriesService = inject(SubcategoriesService);
  public loading = false;
  public firstLoading = true;

  constructor() {
    this.getCategories();
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
}
