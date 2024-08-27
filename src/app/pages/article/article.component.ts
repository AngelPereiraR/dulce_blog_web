import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  signal,
  SimpleChanges,
  type OnInit,
} from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { SubcategoriesService } from '../../services/subcategories.service';
import { Article, Category, Subcategory } from '../../interfaces';
import { ArticlesService } from '../../services/articles.service';
import { ActivatedRoute } from '@angular/router';
import { NotFoundComponent } from '../errors/not_found/not_found.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { CarouselComponent } from '../../components/carousel/carousel.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    CommonModule,
    NotFoundComponent,
    SpinnerComponent,
    CarouselComponent,
  ],
  templateUrl: './article.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ArticleComponent implements OnInit {
  private categoriesService = inject(CategoriesService);
  private _category = signal<Category | undefined>(undefined);
  public category = computed(() => this._category());
  private subcategoriesService = inject(SubcategoriesService);
  private _subcategory = signal<Subcategory | undefined>(undefined);
  public subcategory = computed(() => this._subcategory());
  private articlesService = inject(ArticlesService);
  private _article = signal<Article | undefined>(undefined);
  public article = computed(() => this._article());
  public loading: boolean = false;
  public firstLoading: boolean = false;

  public elementNotFound: boolean = true;

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute) {
    this.firstLoading = true;

    this.route.paramMap.subscribe((params) => {
      this.getCategory(params.get('categoryId'));
      this.getSubcategory(params.get('subcategoryId'));
      this.getArticle(params.get('articleId'));
    });
  }

  ngOnInit(): void {}

  getCategory(categoryId: string | null): void {
    this.loading = true;

    let subcategoriesDisabled = true;

    this.categoriesService.getCategory(categoryId!).subscribe({
      next: (category) => {
        if (category.enabled) {
          if (category.subcategories) {
            for (let subcategory of category.subcategories) {
              if (subcategory.enabled) subcategoriesDisabled = false;
            }
          }
        }

        this._category.set({
          ...category,
          showSubcategories: false,
          subcategoriesDisabled,
        });
      },
      error: (message) => {
        this.elementNotFound = true;
      },
      complete: () => {
        this.elementNotFound = false;
      },
    });
  }

  getSubcategory(subcategoryId: string | null): void {
    this.loading = true;

    this.subcategoriesService.getSubcategory(subcategoryId!).subscribe({
      next: (subcategory) => {
        if (subcategory.enabled) {
          this._subcategory.set({ ...subcategory });
        }
      },
      error: (message) => {
        this.elementNotFound = true;
      },
      complete: () => {
        this.elementNotFound = false;
      },
    });
  }

  getArticle(articleId: string | null) {
    this.articlesService.getArticle(articleId!).subscribe({
      next: (article) => {
        this._article.set({
          ...article,
        });
      },
      error: () => {
        this.elementNotFound = true;
        this.loading = false;
        this.firstLoading = false;
      },
      complete: () => {
        this.elementNotFound = false;
        this.loading = false;
        this.firstLoading = false;
      },
    });
  }
}
