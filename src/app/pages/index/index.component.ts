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
import { ArticlesService } from '../../services/articles.service';
import { Article } from '../../interfaces';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterModule, CarouselComponent, SpinnerComponent],
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexComponent implements OnInit {
  private articlesService = inject(ArticlesService);
  private _article = signal<Article | undefined>(undefined);
  public article = computed(() => this._article());
  public loading: boolean = false;
  public firstLoading: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.firstLoading = true;
    this.getArticles();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger a change detection cycle to repaint the HTML
    this.cdr.detectChanges();
  }

  getArticles(): void {
    this.articlesService.getArticles().subscribe({
      next: (articles) => {
        articles.sort((a, b) => a.orderNumber - b.orderNumber);
        for (let article of articles) {
          if (article.enabled && article.published_at) {
            this._article.set(article);
          }
        }

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
}
