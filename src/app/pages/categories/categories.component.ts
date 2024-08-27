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
import { Category } from '../../interfaces';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit {
  private categoriesService = inject(CategoriesService);
  private _categories = signal<Category[] | undefined>(undefined);
  public categories = computed(() => this._categories());
  public loading: boolean = false;
  public firstLoading: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.firstLoading = true;
    this.getCategories();
  }

  ngOnInit(): void {}

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
      },
      error: (message) => {
        this.loading = false;
        this.firstLoading = false;
      },
      complete: () => {
        this.loading = false;
        this.firstLoading = false;
      },
    });
  }
}
