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
import { Category, Subcategory } from '../../interfaces';
import { CategoriesService } from '../../services/categories.service';
import { ActivatedRoute } from '@angular/router';
import { NotFoundComponent } from '../errors/not_found/not_found.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, NotFoundComponent, SpinnerComponent],
  templateUrl: './category.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CategoryComponent implements OnInit {
  private categoriesService = inject(CategoriesService);
  private _category = signal<Category | undefined>(undefined);
  public category = computed(() => this._category());
  public loading: boolean = false;
  public firstLoading: boolean = false;

  public elementNotFound: boolean = true;

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute) {
    this.firstLoading = true;

    this.route.paramMap.subscribe((params) => {
      this.getCategory(params.get('categoryId'));
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
