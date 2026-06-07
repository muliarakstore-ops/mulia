export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  category: 'sofa' | 'table' | 'lighting' | 'decor';
  image: string;
  specs?: string[]; // Bullet specs for detail page/modal
}
