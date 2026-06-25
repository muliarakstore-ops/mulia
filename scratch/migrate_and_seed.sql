-- MIGRATION AND SEED SCRIPT FOR SIZES VARIANT IMPLEMENTATION
-- Copy and paste this script into your Supabase SQL Editor (https://supabase.com/dashboard/project/_/editor) to migrate products and seed transactions.

DO $$
DECLARE
    v_prod_single UUID;
    v_prod_end UUID;
    v_prod_double UUID;
    v_prod_gudang UUID;
    v_prod_kasir_lurus UUID;
    v_prod_kasir_l UUID;
    v_prod_snack UUID;
    
    v_klk1 VARCHAR(100);
    v_klk2 VARCHAR(100);
    v_sale1 VARCHAR(100);
    v_sale2 VARCHAR(100);
    v_sale3 VARCHAR(100);
BEGIN
    -- 1. Clear old transaction data to avoid duplicates/foreign key violations
    DELETE FROM transaksi_opex;
    DELETE FROM transaksi_perawatan_aset;
    DELETE FROM transaksi_prive;
    DELETE FROM detail_penjualan_produk;
    DELETE FROM transaksi_penjualan;
    DELETE FROM detail_kulakan_produk;
    DELETE FROM transaksi_kulakan;
    DELETE FROM transaksi_permodalan;

    -- 2. Delete the old generic Rak Gondola products
    DELETE FROM products WHERE name IN ('Rak Gondola Single (Satu Sisi)', 'Rak Gondola Double (Dua Sisi)');

    -- 3. Insert new variant products if they don't exist
    -- Single 120
    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Rak Gondola Single 120') THEN
        INSERT INTO products (name, category, min_price, max_price, image_url, description, height, length, width, additional_info, stock)
        VALUES ('Rak Gondola Single 120', 'sofa', 825000, 825000, '/img/katalog/rak-single.jpeg', 'Rak minimarket satu sisi berkualitas tinggi untuk dipasang merapat ke dinding. Terbuat dari bahan besi baja kokoh dengan finishing powder coating anti karat.', 120, 90, 35, 'Tinggi Tiang: 120 cm' || chr(10) || 'Panjang Shelving: 90 cm per unit' || chr(10) || 'Lebar Shelving Dasar: 35 cm (shelving atas 30 cm)' || chr(10) || 'Kapasitas Beban: s/d 50 kg per tingkat ambalan' || chr(10) || 'Ketebalan Plat Shelving: 0.7 mm baja canai dingin' || chr(10) || 'Finishing: Powder Coating EPOXY tahan gores & pudar', 25);
    END IF;

    -- Single 150
    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Rak Gondola Single 150') THEN
        INSERT INTO products (name, category, min_price, max_price, image_url, description, height, length, width, additional_info, stock)
        VALUES ('Rak Gondola Single 150', 'sofa', 900000, 900000, '/img/katalog/rak-single.jpeg', 'Rak minimarket satu sisi berkualitas tinggi untuk dipasang merapat ke dinding. Terbuat dari bahan besi baja kokoh dengan finishing powder coating anti karat.', 150, 90, 35, 'Tinggi Tiang: 150 cm' || chr(10) || 'Panjang Shelving: 90 cm per unit' || chr(10) || 'Lebar Shelving Dasar: 35 cm (shelving atas 30 cm)' || chr(10) || 'Kapasitas Beban: s/d 50 kg per tingkat ambalan' || chr(10) || 'Ketebalan Plat Shelving: 0.7 mm baja canai dingin' || chr(10) || 'Finishing: Powder Coating EPOXY tahan gores & pudar', 25);
    END IF;

    -- Single 170
    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Rak Gondola Single 170') THEN
        INSERT INTO products (name, category, min_price, max_price, image_url, description, height, length, width, additional_info, stock)
        VALUES ('Rak Gondola Single 170', 'sofa', 950000, 950000, '/img/katalog/rak-single.jpeg', 'Rak minimarket satu sisi berkualitas tinggi untuk dipasang merapat ke dinding. Terbuat dari bahan besi baja kokoh dengan finishing powder coating anti karat.', 170, 90, 35, 'Tinggi Tiang: 170 cm' || chr(10) || 'Panjang Shelving: 90 cm per unit' || chr(10) || 'Lebar Shelving Dasar: 35 cm (shelving atas 30 cm)' || chr(10) || 'Kapasitas Beban: s/d 50 kg per tingkat ambalan' || chr(10) || 'Ketebalan Plat Shelving: 0.7 mm baja canai dingin' || chr(10) || 'Finishing: Powder Coating EPOXY tahan gores & pudar', 25);
    END IF;

    -- Double 120
    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Rak Gondola Double 120') THEN
        INSERT INTO products (name, category, min_price, max_price, image_url, description, height, length, width, additional_info, stock)
        VALUES ('Rak Gondola Double 120', 'table', 1000000, 1000000, '/img/katalog/rak-double.jpeg', 'Rak lorong tengah minimarket dengan dua sisi shelving berhadapan. Struktur penahan kokoh untuk memaksimalkan kapasitas penyimpanan display produk ritel.', 120, 90, 65, 'Tinggi Tiang: 120 cm (dua sisi bolak-balik)' || chr(10) || 'Panjang Shelving: 90 cm' || chr(10) || 'Lebar Shelving Dasar: 35 cm (shelving atas 30 cm)' || chr(10) || 'Kapasitas Beban: s/d 50 kg per tingkat ambalan' || chr(10) || 'Ketebalan Plat Tiang: 1.8 mm plat baja profil U' || chr(10) || 'Sistem Pemasangan: Knockdown modular (bisa disambung)', 25);
    END IF;

    -- Double 150
    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Rak Gondola Double 150') THEN
        INSERT INTO products (name, category, min_price, max_price, image_url, description, height, length, width, additional_info, stock)
        VALUES ('Rak Gondola Double 150', 'table', 1200000, 1200000, '/img/katalog/rak-double.jpeg', 'Rak lorong tengah minimarket dengan dua sisi shelving berhadapan. Struktur penahan kokoh untuk memaksimalkan kapasitas penyimpanan display produk ritel.', 150, 90, 65, 'Tinggi Tiang: 150 cm (dua sisi bolak-balik)' || chr(10) || 'Panjang Shelving: 90 cm' || chr(10) || 'Lebar Shelving Dasar: 35 cm (shelving atas 30 cm)' || chr(10) || 'Kapasitas Beban: s/d 50 kg per tingkat ambalan' || chr(10) || 'Ketebalan Plat Tiang: 1.8 mm plat baja profil U' || chr(10) || 'Sistem Pemasangan: Knockdown modular (bisa disambung)', 25);
    END IF;

    -- Double 170
    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Rak Gondola Double 170') THEN
        INSERT INTO products (name, category, min_price, max_price, image_url, description, height, length, width, additional_info, stock)
        VALUES ('Rak Gondola Double 170', 'table', 1350000, 1350000, '/img/katalog/rak-double.jpeg', 'Rak lorong tengah minimarket dengan dua sisi shelving berhadapan. Struktur penahan kokoh untuk memaksimalkan kapasitas penyimpanan display produk ritel.', 170, 90, 65, 'Tinggi Tiang: 170 cm (dua sisi bolak-balik)' || chr(10) || 'Panjang Shelving: 90 cm' || chr(10) || 'Lebar Shelving Dasar: 35 cm (shelving atas 30 cm)' || chr(10) || 'Kapasitas Beban: s/d 50 kg per tingkat ambalan' || chr(10) || 'Ketebalan Plat Tiang: 1.8 mm plat baja profil U' || chr(10) || 'Sistem Pemasangan: Knockdown modular (bisa disambung)', 25);
    END IF;

    -- 4. Get Product UUIDs from products table
    SELECT id INTO v_prod_single FROM products WHERE name = 'Rak Gondola Single 120' LIMIT 1;
    SELECT id INTO v_prod_end FROM products WHERE name = 'Rak Gondola Muka End' LIMIT 1;
    SELECT id INTO v_prod_double FROM products WHERE name = 'Rak Gondola Double 120' LIMIT 1;
    SELECT id INTO v_prod_gudang FROM products WHERE name = 'Rak Gudang Besi Heavy Duty' LIMIT 1;
    SELECT id INTO v_prod_kasir_lurus FROM products WHERE name = 'Meja Kasir Tipe Lurus' LIMIT 1;
    SELECT id INTO v_prod_kasir_l FROM products WHERE name = 'Meja Kasir Komputer Tipe L' LIMIT 1;
    SELECT id INTO v_prod_snack FROM products WHERE name = 'Rak Display Snack & Chiki' LIMIT 1;

    -- 5. Seed Permodalan
    INSERT INTO transaksi_permodalan (id_modal, jenis_permodalan, nominal_tunai, waktu_input)
    VALUES ('MDL-001', '#Injeksi Modal', 250000000, '2026-06-01');

    INSERT INTO transaksi_permodalan (id_modal, jenis_permodalan, nama_aset, nilai_buku_aset, tarif_depresiasi, waktu_input)
    VALUES ('MDL-002', '#Penempatan Aset', 'Mesin Potong Plat CNC', 45000000, 25.00, '2026-06-02');

    -- 6. Seed Kulakan (Restock) Day 1
    INSERT INTO transaksi_kulakan (id_kulakan, waktu_kulakan)
    VALUES ('KLK-001', '2026-06-03')
    RETURNING id_kulakan INTO v_klk1;

    IF v_prod_single IS NOT NULL THEN
        INSERT INTO detail_kulakan_produk (id_kulakan, id_produk, qty_kulakan, harga_kulak_satuan)
        VALUES (v_klk1, v_prod_single, 50, 500000);
    END IF;

    IF v_prod_double IS NOT NULL THEN
        INSERT INTO detail_kulakan_produk (id_kulakan, id_produk, qty_kulakan, harga_kulak_satuan)
        VALUES (v_klk1, v_prod_double, 30, 700000);
    END IF;

    -- Unloading / Bongkar cost for Day 1
    INSERT INTO transaksi_opex (waktu_opex, kategori_operasional, kebutuhan_opex, nominal_opex)
    VALUES ('2026-06-03', '#Bongkar', 'Jasa Bongkar Muatan Baja', 800000);

    -- Seed Kulakan (Restock) Day 2
    INSERT INTO transaksi_kulakan (id_kulakan, waktu_kulakan)
    VALUES ('KLK-002', '2026-06-10')
    RETURNING id_kulakan INTO v_klk2;

    IF v_prod_end IS NOT NULL THEN
        INSERT INTO detail_kulakan_produk (id_kulakan, id_produk, qty_kulakan, harga_kulak_satuan)
        VALUES (v_klk2, v_prod_end, 20, 450000);
    END IF;

    IF v_prod_kasir_lurus IS NOT NULL THEN
        INSERT INTO detail_kulakan_produk (id_kulakan, id_produk, qty_kulakan, harga_kulak_satuan)
        VALUES (v_klk2, v_prod_kasir_lurus, 10, 1000000);
    END IF;

    -- Unloading / Bongkar cost for Day 2
    INSERT INTO transaksi_opex (waktu_opex, kategori_operasional, kebutuhan_opex, nominal_opex)
    VALUES ('2026-06-10', '#Bongkar', 'Upah Harian Unloading', 300000);

    -- 7. Seed Sales
    -- Sale 1: Mandiri Delivery (#Pasang)
    INSERT INTO transaksi_penjualan (id_transaksi, nama_pelanggan, daerah_tujuan, jenis_pengiriman, waktu_transaksi)
    VALUES ('INV-001', 'Toko Sumber Jaya', 'Kota Depok', '#Pasang', '2026-06-12 10:00:00+00')
    RETURNING id_transaksi INTO v_sale1;

    IF v_prod_single IS NOT NULL THEN
        INSERT INTO detail_penjualan_produk (id_transaksi, id_produk, qty_terjual, harga_satuan_nego)
        VALUES (v_sale1, v_prod_single, 15, 850000);
    END IF;

    IF v_prod_double IS NOT NULL THEN
        INSERT INTO detail_penjualan_produk (id_transaksi, id_produk, qty_terjual, harga_satuan_nego)
        VALUES (v_sale1, v_prod_double, 10, 1100000);
    END IF;

    -- Shipping cost for Sale 1
    INSERT INTO transaksi_opex (waktu_opex, kategori_operasional, jenis_pengiriman_opex, nama_pelanggan_terkait, kebutuhan_opex, nominal_opex)
    VALUES ('2026-06-12', '#Pengiriman', '#Pasang', v_sale1, 'Bensin & Tol PickUp Depok', 180000);

    -- Sale 2: Expedition Delivery (#Ekspedisi)
    INSERT INTO transaksi_penjualan (id_transaksi, nama_pelanggan, daerah_tujuan, jenis_pengiriman, nama_ekspedisi, waktu_transaksi)
    VALUES ('INV-002', 'CV. Sentosa Abadi', 'Bandung', '#Ekspedisi', 'Dakota Cargo', '2026-06-18 14:30:00+00')
    RETURNING id_transaksi INTO v_sale2;

    IF v_prod_end IS NOT NULL THEN
        INSERT INTO detail_penjualan_produk (id_transaksi, id_produk, qty_terjual, harga_satuan_nego)
        VALUES (v_sale2, v_prod_end, 8, 880000);
    END IF;

    IF v_prod_kasir_lurus IS NOT NULL THEN
        INSERT INTO detail_penjualan_produk (id_transaksi, id_produk, qty_terjual, harga_satuan_nego)
        VALUES (v_sale2, v_prod_kasir_lurus, 4, 1500000);
    END IF;

    -- Shipping opex for Sale 2 (expedition fee)
    INSERT INTO transaksi_opex (waktu_opex, kategori_operasional, jenis_pengiriman_opex, nama_pelanggan_terkait, kebutuhan_opex, nominal_opex)
    VALUES ('2026-06-18', '#Pengiriman', '#Ekspedisi', v_sale2, 'Resi Dakota Cargo BDG', 450000);

    -- Sale 3: Takeaway (#Ambil)
    INSERT INTO transaksi_penjualan (id_transaksi, nama_pelanggan, daerah_tujuan, jenis_pengiriman, waktu_transaksi)
    VALUES ('INV-003', 'Pak Joko Mandiri', 'Jakarta Selatan', '#Ambil', '2026-06-20 09:00:00+00')
    RETURNING id_transaksi INTO v_sale3;

    IF v_prod_single IS NOT NULL THEN
        INSERT INTO detail_penjualan_produk (id_transaksi, id_produk, qty_terjual, harga_satuan_nego)
        VALUES (v_sale3, v_prod_single, 5, 825000);
    END IF;

    -- 8. Other Opex, Prive & Perawatan
    INSERT INTO transaksi_opex (waktu_opex, kategori_operasional, kebutuhan_opex, nominal_opex)
    VALUES ('2026-06-22', '#Office/Gudang', 'Listrik & WiFi Kantor', 1200000);

    INSERT INTO transaksi_prive (waktu_prive, nama_owner, keterangan_prive, nominal_prive)
    VALUES ('2026-06-23', 'Iqbal', 'Tarik Tunai Keperluan Pribadi', 5000000);

    INSERT INTO transaksi_perawatan_aset (waktu_perawatan, jenis_perawatan, nama_pengeluaran, nominal_biaya)
    VALUES ('2026-06-24', '#Perbaikan', 'Ganti Aki Mobil PickUp Operasional', 750000);

END $$;
