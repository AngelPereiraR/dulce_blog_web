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
  private articlesService = inject(ArticlesService);
  private _article = signal<Article | undefined>(undefined);
  public article = computed(() => this._article());
  public loading: boolean = false;
  public firstLoading: boolean = false;

  public elementNotFound: boolean = true;

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute) {
    this.firstLoading = true;

    this.route.paramMap.subscribe((params) => {
      this.getArticle(params.get('articleId'));
    });
  }

  ngOnInit(): void {}

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
