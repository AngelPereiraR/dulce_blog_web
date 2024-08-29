import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { ArticleComponent } from './pages/article/article.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  {
    path: ':articleId',
    component: ArticleComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
