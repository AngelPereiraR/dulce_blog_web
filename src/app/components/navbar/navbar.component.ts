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
import { Category } from '../../interfaces';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  private categoriesService = inject(CategoriesService);
  private _categories = signal<Category[] | undefined>(undefined);
  public categories = computed(() => this._categories());
  private subcategoriesService = inject(SubcategoriesService);
  public loading: boolean = false;
  public firstLoading: boolean = false;

  private hideTimeouts: { [key: string]: any } = {}; // Para manejar los timeouts

  constructor(private cdr: ChangeDetectorRef) {
    this.firstLoading = true;
    this.getCategories();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger a change detection cycle to repaint the HTML
    this.cdr.detectChanges();
  }

  getCategories(): void {
    this.loading = true;

    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        let categoryList = [];
        for (let category of categories) {
          if (category.enabled) {
            categoryList.push({ ...category, showSubcategories: false });
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

  // Métodos para manejar el mouseover y mouseleave
  showSubcategories(category: Category): void {
    if (this.hideTimeouts[category.slug]) {
      clearTimeout(this.hideTimeouts[category.slug]);
    }
    category.showSubcategories = true;
    this.cdr.detectChanges(); // Forzamos la detección de cambios
  }

  scheduleHideSubcategories(category: Category): void {
    this.hideTimeouts[category.slug] = setTimeout(() => {
      category.showSubcategories = false;
      this.cdr.detectChanges(); // Forzamos la detección de cambios
    }, 300); // Ajusta el tiempo según sea necesario
  }
}
