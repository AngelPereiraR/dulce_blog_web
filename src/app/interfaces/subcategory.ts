import { Article } from './';

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  enabled: boolean;
  created_at: Date;
  updated_at: Date;
  articles: Article[];
  showArticles: boolean;
  articlesDisabled: boolean;
}
