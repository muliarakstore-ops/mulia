import { Product } from '../types';
import { PRODUCTS, WA_NUMBER } from '../constants/mockData';

export interface CmsConfig {
  waNumber: string;
  brandName: string;
  brandSuffix: string;
  heroTitle: string;
  heroSubTitle: string;
  heroDescription: string;
  aboutText: string;
}

export const DEFAULT_CMS: CmsConfig = {
  waNumber: WA_NUMBER,
  brandName: 'MULIA',
  brandSuffix: 'Rak Store',
  heroTitle: 'Peralatan & Rak Toko Premium',
  heroSubTitle: 'Untuk Ritel Modern',
  heroDescription: 'Menyediakan Rak Gondola, Meja Kasir, Rak Rokok, dan aksesoris minimarket berkualitas tinggi langsung dari pabrik dengan standar baja terbaik.',
  aboutText: 'Distributor rak minimarket dan meja kasir berkualitas tinggi dengan jaminan cat powder coating tahan lama serta pemasangan yang presisi.',
};

export const getStoredCms = (): CmsConfig => {
  if (typeof window === 'undefined') return DEFAULT_CMS;
  try {
    const stored = localStorage.getItem('mrs_cms_config');
    return stored ? JSON.parse(stored) : DEFAULT_CMS;
  } catch (e) {
    console.error(e);
    return DEFAULT_CMS;
  }
};

export const saveStoredCms = (config: CmsConfig) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('mrs_cms_config', JSON.stringify(config));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredProducts = (): Product[] => {
  if (typeof window === 'undefined') return PRODUCTS;
  try {
    const stored = localStorage.getItem('mrs_products');
    return stored ? JSON.parse(stored) : PRODUCTS;
  } catch (e) {
    console.error(e);
    return PRODUCTS;
  }
};

export const saveStoredProducts = (products: Product[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('mrs_products', JSON.stringify(products));
  } catch (e) {
    console.error(e);
  }
};

import { IncludedService, INCLUDED_SERVICES } from '../constants/mockData';

export const getStoredServices = (): IncludedService[] => {
  if (typeof window === 'undefined') return INCLUDED_SERVICES;
  try {
    const stored = localStorage.getItem('mrs_services');
    return stored ? JSON.parse(stored) : INCLUDED_SERVICES;
  } catch (e) {
    console.error(e);
    return INCLUDED_SERVICES;
  }
};

export const saveStoredServices = (services: IncludedService[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('mrs_services', JSON.stringify(services));
  } catch (e) {
    console.error(e);
  }
};
