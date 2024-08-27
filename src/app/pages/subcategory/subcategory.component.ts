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
import { Article, Category, Subcategory } from '../../interfaces';
import { ActivatedRoute } from '@angular/router';
import { SubcategoriesService } from '../../services/subcategories.service';
import { NotFoundComponent } from '../errors/not_found/not_found.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { ArticlesService } from '../../services/articles.service';

@Component({
  selector: 'app-subcategory',
  standalone: true,
  imports: [CommonModule, NotFoundComponent, SpinnerComponent],
  templateUrl: './subcategory.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SubcategoryComponent implements OnInit {
  private categoriesService = inject(CategoriesService);
  private _category = signal<Category | undefined>(undefined);
  public category = computed(() => this._category());
  private subcategoriesService = inject(SubcategoriesService);
  private _subcategory = signal<Subcategory | undefined>(undefined);
  public subcategory = computed(() => this._subcategory());
  private articlesService = inject(ArticlesService);
  public loading: boolean = false;
  public firstLoading: boolean = false;

  public elementNotFound: boolean = true;

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute) {
    this.firstLoading = true;

    this.route.paramMap.subscribe((params) => {
      this.getCategory(params.get('categoryId'));
      this.getSubcategory(params.get('subcategoryId'));
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger a change detection cycle to repaint the HTML
    this.cdr.detectChanges();
  }

  getCategory(categoryId: string | null): void {
    this.loading = true;

    let subcategoriesDisabled = true;

    let subcategories: Subcategory[] = [];

    this.categoriesService.getCategory(categoryId!).subscribe({
      next: (category) => {
        if (category.enabled) {
          if (category.subcategories) {
            for (let subcategory of category.subcategories) {
              if (subcategory.enabled) {
                subcategories.push(subcategory);
                subcategoriesDisabled = false;
              }
            }
          }
        }

        this._category.set({
          ...category,
          subcategories,
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
          this.getArticles(subcategory.slug);
        }
      },
      error: (message) => {
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

  getArticles(subcategorySlug: string) {
    let articlesDisabled = true;

    let articlesEnabled: Article[] = [];

    this.articlesService.getArticlesBySubcategory(subcategorySlug).subscribe({
      next: (articles) => {
        const subcategory = this._subcategory();
        if (subcategory) {
          subcategory!.articles = articles;
          if (subcategory.articles) {
            for (let article of subcategory.articles) {
              if (article.enabled && article.published_at)
                articlesEnabled.push({
                  ...article,
                });
              articlesDisabled = false;
            }
          }

          this._subcategory.set({
            ...subcategory,
            articles: articlesEnabled,
            showArticles: false,
            articlesDisabled,
          });
        }
      },
      error: () => {},
      complete: () => {},
    });
  }
}
