import { Subcategory } from './';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  subcategories?: Subcategory[];
  enabled: boolean;
  created_at: Date;
  updated_at: Date;
  showSubcategories: boolean;
  subcategoriesDisabled: boolean;
  orderNumber: number;
}
