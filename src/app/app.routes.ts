import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryComponent } from './pages/category/category.component';
import { SubcategoryComponent } from './pages/subcategory/subcategory.component';
import { ArticleComponent } from './pages/article/article.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: ':categoryId', component: CategoryComponent },
  { path: ':categoryId/:subcategoryId', component: SubcategoryComponent },
  {
    path: ':categoryId/:subcategoryId/:articleId',
    component: ArticleComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
