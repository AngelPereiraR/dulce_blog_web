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
import { RouterModule } from '@angular/router';
import { Category, Subcategory } from '../../interfaces';
import { CategoriesService } from '../../services/categories.service';
import { SubcategoriesService } from '../../services/subcategories.service';
import { ArticlesService } from '../../services/articles.service';
import { Article } from '../../interfaces/article';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexComponent implements OnInit {
  private categoriesService = inject(CategoriesService);
  private _categories = signal<Category[] | undefined>(undefined);
  public categories = computed(() => this._categories());
  // private subcategoriesService = inject(SubcategoriesService);
  // private _subcategories = signal<Subcategory[] | undefined>(undefined);
  // public subcategories = computed(() => this._subcategories());
  // private articlesService = inject(ArticlesService);
  // private _articles = signal<Article[] | undefined>(undefined);
  // public articles = computed(() => this._articles());
  public loading: boolean = false;
  public firstLoading: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.firstLoading = true;
    this.getCategories();
    // this.getSubcategories();
    // this.getArticles();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger a change detection cycle to repaint the HTML
    this.cdr.detectChanges();
  }

  getCategories(): void {
    this.loading = true;

    let subcategoriesDisabled = true;

    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        let categoryList = [];
        for (let category of categories) {
          if (category.enabled) {
            if (category.subcategories) {
              for (let subcategory of category.subcategories) {
                if (subcategory.enabled) subcategoriesDisabled = false;
              }
            }
            categoryList.push({
              ...category,
              showSubcategories: false,
              subcategoriesDisabled,
            });
          }
        }
        this._categories.set(categoryList);
        // Trigger ngOnChanges to repaint the HTML
        this.ngOnChanges({});
      },
      error: (message) => {
        this.loading = false;
        this.firstLoading = false;
        this.ngOnChanges({});
      },
      complete: () => {
        this.loading = false;
        this.firstLoading = false;
        this.ngOnChanges({});
      },
    });
  }

  // getSubcategories(): void {
  //   this.subcategoriesService.getSubcategories().subscribe({
  //     next: (subcategories) => {
  //       let subcategoryList = [];
  //       for (let subcategory of subcategories) {
  //         if (subcategory.enabled) {
  //           subcategoryList.push({
  //             ...subcategory,
  //           });
  //         }
  //       }
  //       this._subcategories.set(subcategoryList);
  //       // Trigger ngOnChanges to repaint the HTML
  //       this.ngOnChanges({});
  //     },
  //     error: (message) => {},
  //     complete: () => {},
  //   });
  // }

  // getArticles(): void {
  //   this.articlesService.getArticles().subscribe({
  //     next: (articles) => {
  //       let articleList = [];
  //       for (let article of articles) {
  //         if (article.enabled && article.published_at) {
  //           articleList.push({
  //             ...article,
  //           });
  //         }
  //       }
  //       this._articles.set(articleList);
  //       // Trigger ngOnChanges to repaint the HTML
  //       this.ngOnChanges({});
  //     },
  //     error: (message) => {
  //       this.loading = false;
  //       this.firstLoading = false;
  //       this.ngOnChanges({});
  //     },
  //     complete: () => {
  //       this.loading = false;
  //       this.firstLoading = false;
  //       this.ngOnChanges({});
  //     },
  //   });
  // }
}
