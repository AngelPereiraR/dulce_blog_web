import { Subcategory } from './subcategory';

export interface Article {
  _id: string;
  title: string;
  slug: string;
  images: string[];
  excerpt: string;
  content: string;
  subcategories: Subcategory[];
  author: string;
  published_at: Date;
  enabled: boolean;
  created_at: Date;
  updated_at: Date;
  orderNumber: number;
}
