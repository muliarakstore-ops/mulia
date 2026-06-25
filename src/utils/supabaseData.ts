import { supabase } from './supabase';
import { Product } from '../types';
import { IncludedService } from '../constants/mockData';
import { CmsConfig, DEFAULT_CMS } from './storage';

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

// ==========================================
// 1. CMS, PROFILE & ABOUT US CONFIGURATION
// ==========================================

export interface FullCmsConfig extends CmsConfig {
  aboutSlogan?: string;
  aboutVision?: string;
  aboutMission?: string;
  establishedYear?: number;
  uniqueProductTitle?: string;
  uniqueProductDescription?: string;
  address?: string;
  email?: string;
  socialMedia?: any[];
  // Section titles
  heroSubTopTitle?: string;
  heroBgImageUrl?: string;
  catalogMainTitle?: string;
  catalogSubTitle?: string;
  catalogColsMobile?: number;
  catalogColsDesktop?: number;
  servicesMainTitle?: string;
  servicesSubTitle?: string;
  shippingMainTitle?: string;
  shippingSubTitle?: string;
  convMainTitle?: string;
  convSubTitle?: string;
  convPhoneImageUrl?: string;
  convCardTitle?: string;
  convCardDescription?: string;
}

export const loadCmsConfig = async (): Promise<FullCmsConfig> => {
  if (!isSupabaseConfigured()) {
    return DEFAULT_CMS;
  }

  try {
    const { data: pageCms, error: pageErr } = await supabase
      .from('cms_pages')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000000')
      .single();

    const { data: profileCms, error: profileErr } = await supabase
      .from('profile')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000000')
      .single();

    const { data: aboutCms, error: aboutErr } = await supabase
      .from('about_us')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000000')
      .single();

    if (pageErr || profileErr || aboutErr) {
      console.warn('Could not fetch complete CMS config, using defaults:', { pageErr, profileErr, aboutErr });
    }

    return {
      // Map profile fields to standard CmsConfig
      waNumber: profileCms?.whatsapp || DEFAULT_CMS.waNumber,
      brandName: profileCms?.brand_name || DEFAULT_CMS.brandName,
      brandSuffix: '', // Can be kept or mapped
      address: profileCms?.address || '',
      email: profileCms?.email || '',
      socialMedia: profileCms?.social_media || [],

      // Map hero config to standard CmsConfig
      heroTitle: pageCms?.hero_main_title || DEFAULT_CMS.heroTitle,
      heroSubTitle: pageCms?.hero_sub_title || DEFAULT_CMS.heroSubTitle,
      heroDescription: pageCms?.hero_description || DEFAULT_CMS.heroDescription,
      heroSubTopTitle: pageCms?.hero_sub_top_title || '',
      heroBgImageUrl: pageCms?.hero_bg_image_url || '',

      // Section Configs
      catalogMainTitle: pageCms?.catalog_main_title || '',
      catalogSubTitle: pageCms?.catalog_sub_title || '',
      catalogColsMobile: pageCms?.catalog_cols_mobile || 1,
      catalogColsDesktop: pageCms?.catalog_cols_desktop || 3,
      servicesMainTitle: pageCms?.services_main_title || '',
      servicesSubTitle: pageCms?.services_sub_title || '',
      shippingMainTitle: pageCms?.shipping_main_title || '',
      shippingSubTitle: pageCms?.shipping_sub_title || '',
      convMainTitle: pageCms?.conv_main_title || '',
      convSubTitle: pageCms?.conv_sub_title || '',
      convPhoneImageUrl: pageCms?.conv_phone_image_url || '',
      convCardTitle: pageCms?.conv_card_title || '',
      convCardDescription: pageCms?.conv_card_description || '',

      // Map about_us fields to standard CmsConfig
      aboutText: aboutCms?.description || DEFAULT_CMS.aboutText,
      aboutSlogan: aboutCms?.slogan || '',
      aboutVision: aboutCms?.vision || '',
      aboutMission: aboutCms?.mission || '',
      establishedYear: aboutCms?.established_year || 2018,
      uniqueProductTitle: aboutCms?.unique_product_title || '',
      uniqueProductDescription: aboutCms?.unique_product_description || '',
    };
  } catch (e) {
    console.error('Failed to load CMS from Supabase, returning defaults:', e);
    return DEFAULT_CMS;
  }
};

export const saveCmsConfig = async (config: FullCmsConfig): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const pageUpdates = {
      hero_main_title: config.heroTitle,
      hero_sub_title: config.heroSubTitle,
      hero_description: config.heroDescription || '',
      hero_sub_top_title: config.heroSubTopTitle || '',
      hero_bg_image_url: config.heroBgImageUrl || '',
      catalog_main_title: config.catalogMainTitle || '',
      catalog_sub_title: config.catalogSubTitle || '',
      catalog_cols_mobile: Number(config.catalogColsMobile || 1),
      catalog_cols_desktop: Number(config.catalogColsDesktop || 3),
      services_main_title: config.servicesMainTitle || '',
      services_sub_title: config.servicesSubTitle || '',
      shipping_main_title: config.shippingMainTitle || '',
      shipping_sub_title: config.shippingSubTitle || '',
      conv_main_title: config.convMainTitle || '',
      conv_sub_title: config.convSubTitle || '',
      conv_phone_image_url: config.convPhoneImageUrl || '',
      conv_card_title: config.convCardTitle || '',
      conv_card_description: config.convCardDescription || '',
    };

    const profileUpdates = {
      brand_name: config.brandName,
      whatsapp: config.waNumber,
      address: config.address || '',
      email: config.email || '',
      social_media: config.socialMedia || [],
    };

    const aboutUpdates = {
      description: config.aboutText,
      slogan: config.aboutSlogan || '',
      vision: config.aboutVision || '',
      mission: config.aboutMission || '',
      established_year: Number(config.establishedYear || 2018),
      unique_product_title: config.uniqueProductTitle || '',
      unique_product_description: config.uniqueProductDescription || '',
    };

    const { error: pageErr } = await supabase
      .from('cms_pages')
      .update(pageUpdates)
      .eq('id', '00000000-0000-0000-0000-000000000000');

    const { error: profileErr } = await supabase
      .from('profile')
      .update(profileUpdates)
      .eq('id', '00000000-0000-0000-0000-000000000000');

    const { error: aboutErr } = await supabase
      .from('about_us')
      .update(aboutUpdates)
      .eq('id', '00000000-0000-0000-0000-000000000000');

    if (pageErr || profileErr || aboutErr) {
      throw new Error(`Supabase update error: ${JSON.stringify({ pageErr, profileErr, aboutErr })}`);
    }

    return true;
  } catch (e) {
    console.error('Failed to save CMS config to Supabase:', e);
    return false;
  }
};


// ==========================================
// 2. PRODUCTS
// ==========================================

export const getSupabaseProducts = async (groupVariants: boolean = false): Promise<Product[]> => {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    const allProducts = (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.min_price === p.max_price 
        ? `Rp ${Number(p.min_price).toLocaleString('id-ID')}` 
        : `Rp ${Number(p.min_price).toLocaleString('id-ID')} - Rp ${Number(p.max_price).toLocaleString('id-ID')}`,
      minPrice: p.min_price,
      maxPrice: p.max_price,
      image: p.image_url || '',
      description: p.description || '',
      specs: p.additional_info ? p.additional_info.split('\n') : [],
      height: p.height,
      length: p.length,
      width: p.width,
      stock: p.stock
    }));

    if (!groupVariants) {
      return allProducts;
    }

    // Grouping variants and generating public-facing configurations
    const groupedList: Product[] = [];
    
    // Find base products
    const g120 = allProducts.find(p => p.name === 'Rak Gondola 120');
    const g150 = allProducts.find(p => p.name === 'Rak Gondola 150');
    const g170 = allProducts.find(p => p.name === 'Rak Gondola 170');
    const mukaEnd = allProducts.find(p => p.name === 'Rak Gondola Muka End');
    const mejaKasir = allProducts.find(p => p.name === 'Meja Kasir');
    const gudang = allProducts.find(p => p.name === 'Rak Gudang Besi Heavy Duty');
    const snack = allProducts.find(p => p.name === 'Rak Display Snack & Chiki');
    const backwall = allProducts.find(p => p.name === 'Backwall');
    const ram120 = allProducts.find(p => p.name === 'RAM 120');
    const ram150 = allProducts.find(p => p.name === 'RAM 150');
    const ram170 = allProducts.find(p => p.name === 'RAM 170');
    const tiang = allProducts.find(p => p.name === 'Tiang Penyangga');
    const priceTag = allProducts.find(p => p.name === 'Price Tag');
    const papanFlat = allProducts.find(p => p.name === 'Papan Flat');

    const gondolaStock = (g120?.stock || 0) + (g150?.stock || 0) + (g170?.stock || 0);
    const mejaKasirStock = mejaKasir?.stock || 0;
    const ramStock = (ram120?.stock || 0) + (ram150?.stock || 0) + (ram170?.stock || 0);

    // 1. Rak Gondola Single (Satu Sisi)
    groupedList.push({
      id: g120?.id || 'gondola-single',
      name: 'Rak Gondola Single (Satu Sisi)',
      category: 'sofa',
      price: 'Rp 825.000 - Rp 950.000',
      minPrice: 825000,
      maxPrice: 950000,
      image: '/img/katalog/rak-single.jpeg',
      description: 'Rak minimarket satu sisi berkualitas tinggi untuk dipasang merapat ke dinding. Terbuat dari bahan besi baja kokoh dengan finishing powder coating anti karat.',
      specs: [
        'Pilihan Tinggi Tiang: 120 cm / 150 cm / 170 cm',
        'Panjang Shelving: 90 cm per unit',
        'Lebar Shelving Dasar: 35 cm (shelving atas 30 cm)',
        'Kapasitas Beban: s/d 50 kg per tingkat ambalan',
        'Ketebalan Plat Shelving: 0.7 mm baja canai dingin',
        'Finishing: Powder Coating EPOXY tahan gores & pudar'
      ],
      height: 180,
      length: 90,
      width: 35,
      stock: gondolaStock
    });

    // 2. Rak Gondola Double (Dua Sisi)
    groupedList.push({
      id: g120?.id || 'gondola-double',
      name: 'Rak Gondola Double (Dua Sisi)',
      category: 'table',
      price: 'Rp 1.000.000 - Rp 1.350.000',
      minPrice: 1000000,
      maxPrice: 1350000,
      image: '/img/katalog/rak-double.jpeg',
      description: 'Rak lorong tengah minimarket dengan dua sisi shelving berhadapan. Struktur penahan kokoh untuk memaksimalkan kapasitas penyimpanan display produk ritel.',
      specs: [
        'Pilihan Tinggi Tiang: 120 cm / 150 cm / 170 cm (dua sisi bolak-balik)',
        'Panjang Shelving: 90 cm',
        'Lebar Shelving Dasar: 35 cm (shelving atas 30 cm)',
        'Kapasitas Beban: s/d 50 kg per tingkat ambalan',
        'Ketebalan Plat Tiang: 1.8 mm plat baja profil U',
        'Sistem Pemasangan: Knockdown modular (bisa disambung)'
      ],
      height: 150,
      length: 90,
      width: 65,
      stock: gondolaStock
    });

    // 3. Rak Gondola Muka End
    if (mukaEnd) {
      groupedList.push({
        ...mukaEnd,
        name: 'Rak Gondola Muka End',
        price: 'Rp 775.000 - Rp 900.000',
        image: '/img/katalog/rak-muka-end.jpeg',
        specs: [
          'Tinggi Tiang: 150 cm / 180 cm (menyesuaikan rak tengah)',
          'Panjang Shelving: 90 cm',
          'Lebar Shelving: Dasar 35 cm (shelving atas 30 cm)',
          'Kapasitas Beban: s/d 50 kg per tingkat',
          'Bahan: Besi baja berkualitas premium standar SNI',
          'Pemasangan: Knockdown (sistem kait tanpa baut)'
        ]
      });
    }

    // 4. Meja Kasir Tipe Lurus
    groupedList.push({
      id: mejaKasir?.id || 'meja-kasir-lurus',
      name: 'Meja Kasir Tipe Lurus',
      category: 'lighting',
      price: 'Rp 1.500.000',
      minPrice: 1500000,
      maxPrice: 1500000,
      image: '/img/katalog/meja-kasir.jpeg',
      description: 'Meja kasir ritel dilapisi plat stainless steel tebal tahan gores dan karat pada permukaannya. Memiliki ruang kaki luas dan struktur kokoh.',
      specs: [
        'Dimensi: Panjang 120 cm, Lebar 60 cm, Tinggi 80 cm',
        'Bahan Permukaan Atas: Plat Stainless Steel anti karat',
        'Bahan Bodi: Plat Besi tebal 0.8 mm standar pabrik',
        'Laci Kasir (Cash Drawer): Dilengkapi kunci pengaman manual',
        'Pelindung Samping: Karet bumper peredam benturan troli'
      ],
      height: 80,
      length: 120,
      width: 60,
      stock: mejaKasirStock
    });

    // 5. Meja Kasir Komputer Tipe L
    groupedList.push({
      id: mejaKasir?.id || 'meja-kasir-l',
      name: 'Meja Kasir Komputer Tipe L',
      category: 'lighting',
      price: 'Rp 3.500.000',
      minPrice: 3500000,
      maxPrice: 3500000,
      image: '/img/katalog/meja-kasir-tipe-L.jpeg',
      description: 'Meja kasir dengan sudut siku L untuk menempatkan monitor komputer, printer kasir, dan laci uang secara rapi dan profesional.',
      specs: [
        'Dimensi Utama: P 160 cm x L 120 cm x T 80 cm (Tipe L Siku)',
        'Bahan Atas: Stainless Steel hairline finishing premium',
        'Laci Komputer: Laci gantung slide rails untuk keyboard',
        'Kelistrikan: Dilengkapi lubang jalur kabel (cable grommet)',
        'Ruang Simpan: Kabinet penyimpanan CPU komputer terproteksi'
      ],
      height: 80,
      length: 160,
      width: 120,
      stock: mejaKasirStock
    });

    // 6. Rak Gudang Besi Heavy Duty
    if (gudang) {
      groupedList.push({
        ...gudang,
        price: 'Rp 800.000',
        specs: [
          'Tinggi Tiang: 200 cm',
          'Panjang Shelving: 100 cm',
          'Lebar Shelving: 40 cm',
          'Kapasitas Beban: s/d 150 kg per tingkat ambalan',
          'Jumlah Susun: 4 Tingkat ambalan besi tebal',
          'Sistem Penguncian: Beam berkunci pengait pengaman'
        ]
      });
    }

    // 7. Rak Display Snack & Chiki
    if (snack) {
      groupedList.push({
        ...snack,
        price: 'Rp 400.000',
        specs: [
          'Tinggi Tiang: 140 cm',
          'Jumlah Basket/Keranjang: 4 tingkat basket kawat gantung',
          'Bahan: Kawat besi baja tebal lapis coating anti gores',
          'Mobilitas: Dilengkapi 4 unit roda nilon (2 roda berpengunci)',
          'Kegunaan: Sangat cocok untuk display snack, ciki, dan mi instan'
        ]
      });
    }

    // 8. Backwall
    if (backwall) {
      groupedList.push({
        ...backwall,
        name: 'Backwall Ritel (Display Kasir)',
        price: 'Rp 2.100.000 - Rp 2.500.000',
        specs: [
          'Tinggi Tiang: 200 cm',
          'Lebar Panel: 120 cm',
          'Bahan: Plat besi & frame aluminium kokoh',
          'Kompartemen: Dilengkapi sekat akrilik rokok',
          'Pintu: Sliding kaca dengan kunci pengaman ganda'
        ]
      });
    }

    // 9. RAM Pagar Jaring
    if (ram120) {
      groupedList.push({
        id: ram120.id,
        name: 'RAM Pagar Jaring (Aksesoris)',
        category: 'decor',
        price: 'Rp 160.000 - Rp 220.000',
        minPrice: 160000,
        maxPrice: 220000,
        image: ram120.image,
        description: 'Pagar jaring RAM besi baja tebal berlapis cat anti karat untuk gantungan aksesoris gantung minimarket.',
        specs: [
          'Pilihan Ukuran Tinggi: 120 cm / 150 cm / 170 cm',
          'Lebar Panel: 90 cm',
          'Bahan: Kawat baja las tebal dengan frame kokoh',
          'Finishing: Chrome plating anti karat & pudar',
          'Kegunaan: Sangat fleksibel untuk memajang barang gantung'
        ],
        height: 120,
        length: 90,
        width: 5,
        stock: ramStock
      });
    }

    // 10. Tiang Penyangga
    if (tiang) {
      groupedList.push({
        ...tiang,
        name: 'Tiang Penyangga Rak',
        price: 'Rp 120.000 - Rp 140.000',
        specs: [
          'Tebal Plat: 1.8 mm plat baja profil U',
          'Finishing: Powder coating EPOXY tahan gores & korosi',
          'Fitur: Lubang pitch presisi untuk sistem knockdown'
        ]
      });
    }

    // 11. Price Tag
    if (priceTag) {
      groupedList.push({
        ...priceTag,
        name: 'Mika Price Tag (Isi 200 pcs)',
        price: 'Rp 1.900.000 - Rp 2.100.000',
        specs: [
          'Isi Bundling: 200 Pcs',
          'Bahan: Mika PVC tebal lentur',
          'Pemasangan: Sistem jepit langsung ke bibir shelving',
          'Kegunaan: Pelindung label barcode & harga'
        ]
      });
    }

    // 12. Papan Flat
    if (papanFlat) {
      groupedList.push({
        ...papanFlat,
        name: 'Papan Flat Akrilik (Isi 5 pcs)',
        price: 'Rp 390.000 - Rp 420.000',
        specs: [
          'Isi Bundling: 5 Pcs',
          'Bahan: Akrilik Bening tebal 2 mm',
          'Fungsi: Divider pembatas antar varian produk di ambalan'
        ]
      });
    }

    return groupedList;

  } catch (e) {
    console.error('Failed to fetch products from Supabase:', e);
    return [];
  }
};

export const saveSupabaseProduct = async (productData: {
  id?: string;
  name: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  description: string;
  imageUrl?: string;
  height: number;
  length: number;
  width: number;
  additionalInfo?: string;
  stock?: number;
}): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const payload = {
      name: productData.name,
      category: productData.category,
      min_price: productData.minPrice,
      max_price: productData.maxPrice,
      description: productData.description,
      image_url: productData.imageUrl,
      height: productData.height,
      length: productData.length,
      width: productData.width,
      additional_info: productData.additionalInfo || '',
      stock: productData.stock || 0
    };

    if (productData.id && !productData.id.startsWith('custom-prod-')) {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', productData.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('products')
        .insert([payload]);
      if (error) throw error;
    }
    return true;
  } catch (e) {
    console.error('Failed to save product to Supabase:', e);
    return false;
  }
};

export const deleteSupabaseProduct = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to delete product from Supabase:', e);
    return false;
  }
};


// ==========================================
// 3. SERVICES
// ==========================================

export const getSupabaseServices = async (): Promise<IncludedService[]> => {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []).map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      iconUrl: s.icon_url || ''
    }));
  } catch (e) {
    console.error('Failed to fetch services from Supabase:', e);
    return [];
  }
};

export const saveSupabaseService = async (serviceData: {
  id?: string;
  title: string;
  description: string;
  iconUrl?: string;
}): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const payload = {
      title: serviceData.title,
      description: serviceData.description,
      icon_url: serviceData.iconUrl || ''
    };

    if (serviceData.id) {
      const { error } = await supabase
        .from('services')
        .update(payload)
        .eq('id', serviceData.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('services')
        .insert([payload]);
      if (error) throw error;
    }
    return true;
  } catch (e) {
    console.error('Failed to save service to Supabase:', e);
    return false;
  }
};

export const deleteSupabaseService = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to delete service from Supabase:', e);
    return false;
  }
};


// ==========================================
// 4. ANALYTICS METRICS & LEADS
// ==========================================

export const getAnalyticsStats = async () => {
  if (!isSupabaseConfigured()) return { visits: 0, screentime: 0, shippingChecks: 0 };
  try {
    const { count: visitsCount } = await supabase
      .from('analytics_metrics')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'visit');

    const { data: screentimeData } = await supabase
      .from('analytics_metrics')
      .select('screentime_seconds')
      .eq('event_type', 'screentime');

    const totalScreentime = (screentimeData || []).reduce((acc: number, row: any) => acc + (row.screentime_seconds || 0), 0);

    const { count: shippingCount } = await supabase
      .from('analytics_metrics')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'shipping_check');

    return {
      visits: visitsCount || 0,
      screentime: totalScreentime || 0,
      shippingChecks: shippingCount || 0
    };
  } catch (e) {
    console.error('Error fetching analytics stats:', e);
    return { visits: 0, screentime: 0, shippingChecks: 0 };
  }
};

export const getRawVisits = async (): Promise<{ created_at: string }[]> => {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('analytics_metrics')
      .select('created_at')
      .eq('event_type', 'visit')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []) as { created_at: string }[];
  } catch (e) {
    console.error('Error fetching raw visits:', e);
    return [];
  }
};

export const insertAnalyticsEvent = async (eventType: 'visit' | 'screentime' | 'shipping_check', screentime?: number, metadata?: any) => {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('analytics_metrics').insert([{
      event_type: eventType,
      screentime_seconds: screentime || null,
      metadata: metadata || null
    }]);
  } catch (e) {
    console.error('Failed to track event:', e);
  }
};

export const getLeadsData = async () => {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e: any) {
    console.error('Error fetching leads:', e?.message || e?.details || JSON.stringify(e) || e);
    return [];
  }
};

export const insertLeadRecord = async (lead: {
  type: 'product' | 'service';
  referenceId?: string;
  customerName: string;
  customerPhone: string;
  message?: string;
}) => {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('leads').insert([{
      type: lead.type,
      reference_id: lead.referenceId || null,
      customer_name: lead.customerName,
      customer_phone: lead.customerPhone,
      message: lead.message || null,
      status: 'new'
    }]);
  } catch (e) {
    console.error('Failed to insert lead:', e);
  }
};

export const updateLeadStatus = async (id: string, status: 'new' | 'contacted' | 'deal' | 'canceled') => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to update lead status:', e);
    return false;
  }
};


// ==========================================
// 5. TRANSACTIONS & RESTOCKS
// ==========================================

export const getSupabaseTransactions = async () => {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('Error fetching transactions:', e);
    return [];
  }
};

export const saveSupabaseTransaction = async (tx: {
  date: string;
  type: 'income' | 'expense';
  category: string;
  subcategory?: string;
  amount: number;
  description?: string;
}) => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        date: tx.date,
        type: tx.type,
        category: tx.category,
        subcategory: tx.subcategory || null,
        amount: tx.amount,
        description: tx.description || null
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Failed to insert transaction:', e);
    return null;
  }
};


// ==========================================
// 6. CREATIVE WORK (VIDEOS & DESIGNS)
// ==========================================

export const getSupabaseVideos = async () => {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('creative_videos')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('Error fetching creative videos:', e);
    return [];
  }
};

export const saveSupabaseVideo = async (video: {
  id?: string;
  title: string;
  videoUrl?: string;
  status: 'produced' | 'posted' | 'draft';
  postedAt?: string;
}) => {
  if (!isSupabaseConfigured()) return false;
  try {
    const payload = {
      title: video.title,
      video_url: video.videoUrl || null,
      status: video.status,
      posted_at: video.postedAt || null
    };

    if (video.id) {
      const { error } = await supabase
        .from('creative_videos')
        .update(payload)
        .eq('id', video.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('creative_videos')
        .insert([payload]);
      if (error) throw error;
    }
    return true;
  } catch (e) {
    console.error('Error saving video:', e);
    return false;
  }
};

export const getSupabaseDesigns = async () => {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('creative_designs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('Error fetching creative designs:', e);
    return [];
  }
};

export const saveSupabaseDesign = async (design: {
  id?: string;
  title: string;
  imageUrl: string;
  status: 'produced' | 'draft';
}) => {
  if (!isSupabaseConfigured()) return false;
  try {
    const payload = {
      title: design.title,
      image_url: design.imageUrl,
      status: design.status
    };

    if (design.id) {
      const { error } = await supabase
        .from('creative_designs')
        .update(payload)
        .eq('id', design.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('creative_designs')
        .insert([payload]);
      if (error) throw error;
    }
    return true;
  } catch (e) {
    console.error('Error saving design:', e);
    return false;
  }
};

export const deleteSupabaseVideo = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('creative_videos')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Error deleting video:', e);
    return false;
  }
};

export const deleteSupabaseDesign = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('creative_designs')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Error deleting design:', e);
    return false;
  }
};
