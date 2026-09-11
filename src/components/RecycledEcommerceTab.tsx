import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  PlusCircle,
  Tag,
  Sparkles,
  CheckCircle2,
  Clock,
  Package,
  Store,
  Wallet,
  Coins,
  MapPin,
  ArrowRight,
  Filter,
  X,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { RecycledOrder, RecycledProduct, RecycledProductCategory, Student } from '../types';
import { INITIAL_RECYCLED_ORDERS, INITIAL_RECYCLED_PRODUCTS } from '../data/initialData';

interface RecycledEcommerceTabProps {
  currentStudent: Student;
  onUpdateStudentBalance?: (newBalance: number) => void;
}

export const RecycledEcommerceTab: React.FC<RecycledEcommerceTabProps> = ({
  currentStudent,
  onUpdateStudentBalance,
}) => {
  // State
  const [products, setProducts] = useState<RecycledProduct[]>(() => {
    try {
      const saved = localStorage.getItem('opung_recycled_products');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_RECYCLED_PRODUCTS;
  });

  const [orders, setOrders] = useState<RecycledOrder[]>(() => {
    try {
      const saved = localStorage.getItem('opung_recycled_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_RECYCLED_ORDERS;
  });

  const [activeSubTab, setActiveSubTab] = useState<'katalog' | 'pesanan'>('katalog');
  const [selectedCategory, setSelectedCategory] = useState<RecycledProductCategory>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedProductToBuy, setSelectedProductToBuy] = useState<RecycledProduct | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'saldo_tabungan' | 'tunai_koperasi'>('saldo_tabungan');
  const [isSubmitProductModalOpen, setIsSubmitProductModalOpen] = useState(false);
  const [purchaseSuccessOrder, setPurchaseSuccessOrder] = useState<RecycledOrder | null>(null);

  // New product form state (FR-ECOM-02)
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<'kerajinan' | 'pertanian' | 'alat_tulis' | 'fashion'>('kerajinan');
  const [newProductMaterial, setNewProductMaterial] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('15000');
  const [newProductStock, setNewProductStock] = useState('10');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [submissionSuccessNotice, setSubmissionSuccessNotice] = useState(false);

  // Filtering
  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === 'semua' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.materialSource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.producerClass.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Save to localStorage helpers
  const persistProducts = (updated: RecycledProduct[]) => {
    setProducts(updated);
    try {
      localStorage.setItem('opung_recycled_products', JSON.stringify(updated));
    } catch {}
  };

  const persistOrders = (updated: RecycledOrder[]) => {
    setOrders(updated);
    try {
      localStorage.setItem('opung_recycled_orders', JSON.stringify(updated));
    } catch {}
  };

  // Handle buy confirmation (FR-ECOM-03)
  const handleConfirmPurchase = () => {
    if (!selectedProductToBuy) return;
    const totalPrice = selectedProductToBuy.priceRp * orderQuantity;

    if (paymentMethod === 'saldo_tabungan' && currentStudent.balanceRp < totalPrice) {
      alert('Saldo tabungan bank sampah tidak mencukupi untuk pembelian ini.');
      return;
    }

    if (paymentMethod === 'saldo_tabungan' && onUpdateStudentBalance) {
      onUpdateStudentBalance(currentStudent.balanceRp - totalPrice);
    }

    // Deduct stock from product
    const updatedProducts = products.map((p) =>
      p.id === selectedProductToBuy.id
        ? { ...p, stock: Math.max(0, p.stock - orderQuantity), soldCount: p.soldCount + orderQuantity }
        : p
    );
    persistProducts(updatedProducts);

    // Create new order entry
    const newOrder: RecycledOrder = {
      id: 'ord-' + Date.now(),
      orderNumber: `ORD-OPS-${Math.floor(100000 + Math.random() * 900000)}`,
      productId: selectedProductToBuy.id,
      productName: selectedProductToBuy.name,
      productImage: selectedProductToBuy.image,
      producerClass: selectedProductToBuy.producerClass,
      buyerName: currentStudent.name,
      buyerClass: currentStudent.className,
      quantity: orderQuantity,
      totalPriceRp: totalPrice,
      paymentMethod,
      status: 'menunggu_verifikasi',
      createdAt: 'Baru Saja',
      pickupLocation: 'Pojok Daur Ulang Bank Sampah (Gedung B)',
    };

    const updatedOrders = [newOrder, ...orders];
    persistOrders(updatedOrders);

    setSelectedProductToBuy(null);
    setOrderQuantity(1);
    setPurchaseSuccessOrder(newOrder);
  };

  // Handle class product submission (FR-ECOM-02)
  const handleSubmitNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newProductMaterial.trim()) return;

    const emojiMap: Record<string, string> = {
      kerajinan: '🪴',
      pertanian: '🌱',
      alat_tulis: '✏️',
      fashion: '👜',
    };

    const newDraft: RecycledProduct = {
      id: 'prod-' + Date.now(),
      name: newProductName.trim(),
      priceRp: parseInt(newProductPrice) || 10000,
      producerClass: currentStudent.className,
      materialSource: newProductMaterial.trim(),
      category: newProductCategory,
      image: emojiMap[newProductCategory] || '📦',
      description: newProductDesc.trim() || 'Karya daur ulang inovatif kreasi siswa.',
      stock: parseInt(newProductStock) || 5,
      soldCount: 0,
      rating: 5.0,
      status: 'draft_pending',
    };

    const updated = [newDraft, ...products];
    persistProducts(updated);

    // Reset form
    setNewProductName('');
    setNewProductMaterial('');
    setNewProductPrice('15000');
    setNewProductStock('10');
    setNewProductDesc('');
    setIsSubmitProductModalOpen(false);
    setSubmissionSuccessNotice(true);
    setTimeout(() => setSubmissionSuccessNotice(false), 6000);
  };

  return (
    <div className="w-full space-y-4 pb-24 pt-2 md:px-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-stone-900 text-white rounded-2xl p-4 border border-stone-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Sparkles size={14} />
              <span>Bazaar Sirkular Sekolah</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
              Etalase Karya Daur Ulang Siswa
            </h2>
            <p className="text-xs text-stone-300 max-w-md leading-relaxed">
              Dukung sirkular ekonomi kreatif. 100% keuntungan penjualan dialokasikan langsung ke saldo kas kelas produsen.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSubmitProductModalOpen(true)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
            >
              <PlusCircle size={15} />
              <span>Ajukan Karya Kelas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submission success toast */}
      {submissionSuccessNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>Karya daur ulang kelasmu berhasil diajukan! Menunggu kurasi & verifikasi dari Koordinator Bank Sampah.</span>
          </div>
          <button onClick={() => setSubmissionSuccessNotice(false)} className="text-emerald-700 hover:text-emerald-950">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Tab Switcher: Katalog vs Pesanan Saya */}
      <div className="bg-stone-100 p-1 rounded-xl flex items-center gap-1 border border-stone-200">
        <button
          onClick={() => setActiveSubTab('katalog')}
          className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'katalog'
              ? 'bg-white text-stone-900 font-bold shadow-xs border border-stone-200/80'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Store size={15} />
          <span>Katalog Produk ({products.filter((p) => p.status === 'published').length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('pesanan')}
          className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'pesanan'
              ? 'bg-white text-stone-900 font-bold shadow-xs border border-stone-200/80'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package size={15} />
          <span>Pesanan Saya ({orders.length})</span>
        </button>
      </div>

      {/* SUBTAB: KATALOG PRODUK */}
      {activeSubTab === 'katalog' && (
        <div className="space-y-3">
          {/* Search and Category Pills */}
          <div className="space-y-2">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Cari nama barang, asal sampah, atau kelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category scrollable filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {(
                [
                  { id: 'semua', label: 'Semua' },
                  { id: 'kerajinan', label: 'Kerajinan' },
                  { id: 'pertanian', label: 'Pupuk & Kompos' },
                  { id: 'alat_tulis', label: 'Alat Tulis' },
                  { id: 'fashion', label: 'Tas & Aksesoris' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium ${
                    selectedCategory === cat.id
                      ? 'bg-stone-900 text-white font-bold'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-stone-200 p-6 space-y-2">
              <ShoppingBag className="mx-auto text-stone-300" size={36} />
              <p className="text-xs font-semibold text-stone-700">Tidak ada produk daur ulang ditemukan</p>
              <p className="text-[11px] text-stone-500">Coba ubah kata kunci pencarian atau kategori filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProducts.map((prod) => {
                const isDraft = prod.status === 'draft_pending';

                return (
                  <div
                    key={prod.id}
                    className={`bg-white rounded-xl border transition-all flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-xs ${
                      isDraft ? 'border-amber-300 bg-amber-50/20' : 'border-stone-200'
                    }`}
                  >
                    <div className="p-3.5 space-y-2.5">
                      {/* Top Header Card */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-2xl shrink-0">
                          {prod.image}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            Rp {prod.priceRp.toLocaleString('id-ID')}
                          </span>
                          <div className="text-[10px] text-stone-500 mt-1">
                            {isDraft ? (
                              <span className="text-amber-700 font-medium">Menunggu Verifikasi</span>
                            ) : (
                              <span>Stok: {prod.stock} unit</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Product Title & Producer */}
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] bg-stone-100 text-stone-700 font-semibold px-1.5 py-0.2 rounded border border-stone-200">
                            {prod.producerClass}
                          </span>
                          {isDraft && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                              Draf Baru
                            </span>
                          )}
                        </div>
                        <h3 className="text-xs font-bold text-stone-900 mt-1 leading-snug">
                          {prod.name}
                        </h3>
                      </div>

                      {/* Material Origin Tag (FR-ECOM-01) */}
                      <div className="bg-stone-50 p-2 rounded-lg border border-stone-200 text-[11px] text-stone-700 space-y-0.5">
                        <div className="text-[10px] text-stone-500 font-medium flex items-center gap-1">
                          <Tag size={11} className="text-stone-400" />
                          <span>Asal Bahan Daur Ulang:</span>
                        </div>
                        <div className="font-semibold text-stone-800 leading-tight">
                          {prod.materialSource}
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-3 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div className="text-[10px] text-stone-500">
                        Terjual <span className="font-semibold font-mono text-stone-700">{prod.soldCount}</span> unit
                      </div>

                      {isDraft ? (
                        <span className="text-[10px] text-amber-700 bg-amber-100/70 font-medium px-2 py-1 rounded">
                          Sedang Dikurasi
                        </span>
                      ) : (
                        <button
                          disabled={prod.stock === 0}
                          onClick={() => {
                            setSelectedProductToBuy(prod);
                            setOrderQuantity(1);
                          }}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                            prod.stock === 0
                              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                              : 'bg-stone-900 hover:bg-stone-800 text-white'
                          }`}
                        >
                          <ShoppingBag size={13} />
                          <span>{prod.stock === 0 ? 'Habis' : 'Beli / Pesan'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB: PESANAN SAYA (FR-ECOM-03) */}
      {activeSubTab === 'pesanan' && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-stone-200 p-3 flex items-center justify-between text-xs text-stone-600">
            <span className="font-medium">Alur Status:</span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 font-semibold rounded">Menunggu</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 font-semibold rounded">Siap Diambil</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded">Selesai</span>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-stone-200 p-6 space-y-2">
              <Package className="mx-auto text-stone-300" size={36} />
              <p className="text-xs font-semibold text-stone-700">Belum ada pesanan produk daur ulang</p>
              <p className="text-[11px] text-stone-500">Kunjungi katalog produk untuk mulai mendukung kerajinan teman-temanmu!</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {orders.map((order) => {
                let statusBadge = (
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock size={11} /> Menunggu Verifikasi
                  </span>
                );

                if (order.status === 'siap_diambil') {
                  statusBadge = (
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Package size={11} /> Siap Diambil
                    </span>
                  );
                } else if (order.status === 'selesai') {
                  statusBadge = (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={11} /> Selesai
                    </span>
                  );
                }

                return (
                  <div key={order.id} className="bg-white rounded-xl border border-stone-200 p-3.5 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                      <div>
                        <div className="text-[10px] font-mono font-semibold text-stone-500">{order.orderNumber}</div>
                        <div className="text-[11px] text-stone-400">{order.createdAt}</div>
                      </div>
                      {statusBadge}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-xl shrink-0">
                          {order.productImage}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 truncate leading-snug">
                            {order.productName}
                          </h4>
                          <div className="text-[10px] text-stone-500">
                            {order.quantity} unit • Produsen: <span className="font-semibold text-stone-700">{order.producerClass}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-stone-900">
                          Rp {order.totalPriceRp.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {order.paymentMethod === 'saldo_tabungan' ? 'Saldo Tabungan' : 'Tunai saat Ambil'}
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/80 flex items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-stone-600 truncate">
                        <MapPin size={13} className="text-stone-400 shrink-0" />
                        <span className="truncate">Titik Ambil: {order.pickupLocation}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-medium shrink-0">Kas Masuk Kelas {order.producerClass}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL CHECKOUT / BELI (FR-ECOM-03) */}
      {selectedProductToBuy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden min-w-0 rounded-2xl border border-stone-200 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-emerald-700" />
                <h3 className="text-sm font-bold text-stone-900">Konfirmasi Pemesanan Karya</h3>
              </div>
              <button
                onClick={() => setSelectedProductToBuy(null)}
                className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <X size={16} />
              </button>
            </div>

            {/* Product Summary */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-2xl shrink-0">
                {selectedProductToBuy.image}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-stone-900 truncate">{selectedProductToBuy.name}</h4>
                <div className="text-[10px] text-stone-500">
                  Dibuat oleh: <span className="font-semibold text-stone-800">{selectedProductToBuy.producerClass}</span>
                </div>
                <div className="text-xs font-mono font-bold text-emerald-800 mt-0.5">
                  Rp {selectedProductToBuy.priceRp.toLocaleString('id-ID')} / unit
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Jumlah Pesanan</label>
              <div className="flex items-center justify-between p-2 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-xs text-stone-600">Stok tersisa: {selectedProductToBuy.stock}</span>
                <div className="flex items-center gap-3">
                  <button
                    disabled={orderQuantity <= 1}
                    onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm text-stone-900 w-6 text-center">
                    {orderQuantity}
                  </span>
                  <button
                    disabled={orderQuantity >= selectedProductToBuy.stock}
                    onClick={() => setOrderQuantity(Math.min(selectedProductToBuy.stock, orderQuantity + 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700">Metode Pembayaran</label>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('saldo_tabungan')}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'saldo_tabungan'
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Wallet size={16} className={paymentMethod === 'saldo_tabungan' ? 'text-emerald-700' : 'text-stone-500'} />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Potong Saldo Tabungan</div>
                      <div className="text-[10px] text-stone-500">
                        Saldo saat ini: <span className="font-mono font-semibold">Rp {currentStudent.balanceRp.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'saldo_tabungan' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-300'}`}>
                    {paymentMethod === 'saldo_tabungan' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('tunai_koperasi')}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'tunai_koperasi'
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Coins size={16} className={paymentMethod === 'tunai_koperasi' ? 'text-emerald-700' : 'text-stone-500'} />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Bayar Tunai di Koperasi</div>
                      <div className="text-[10px] text-stone-500">Bayar saat mengambil barang di sekolah</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'tunai_koperasi' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-300'}`}>
                    {paymentMethod === 'tunai_koperasi' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Total Calculation */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({orderQuantity} unit)</span>
                <span className="font-mono">Rp {(selectedProductToBuy.priceRp * orderQuantity).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Alokasi ke Kas {selectedProductToBuy.producerClass}</span>
                <span className="font-mono text-emerald-700">100% Bersih</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900 text-sm">
                <span>Total Bayar</span>
                <span className="font-mono text-emerald-800">
                  Rp {(selectedProductToBuy.priceRp * orderQuantity).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedProductToBuy(null)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmPurchase}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Pesan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUCCESS ORDER (FR-ECOM-03) */}
      {purchaseSuccessOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-[calc(100vw-2rem)] sm:max-w-sm max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden min-w-0 rounded-2xl border border-stone-200 p-5 text-center space-y-3 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 size={26} />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Pesanan Berhasil Dicatat!</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Pesanan <span className="font-mono font-semibold">{purchaseSuccessOrder.orderNumber}</span> sedang menunggu verifikasi koordinator bank sampah.
            </p>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-500">Produk:</span>
                <span className="font-bold text-stone-900">{purchaseSuccessOrder.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total:</span>
                <span className="font-mono font-bold text-stone-900">Rp {purchaseSuccessOrder.totalPriceRp.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Lokasi Ambil:</span>
                <span className="text-stone-700 text-right">{purchaseSuccessOrder.pickupLocation}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setPurchaseSuccessOrder(null);
                setActiveSubTab('pesanan');
              }}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Lihat Pesanan Saya
            </button>
          </div>
        </div>
      )}

      {/* MODAL UNGGAH DRAF KARYA KELAS (FR-ECOM-02) */}
      {isSubmitProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden min-w-0 rounded-2xl border border-stone-200 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Ajukan Karya Daur Ulang Kelas</h3>
                <p className="text-[11px] text-stone-500">Draf akan dikurasi koordinator sebelum tampil publik</p>
              </div>
              <button
                onClick={() => setIsSubmitProductModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitNewProduct} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Nama Produk / Kerajinan</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Lampu Hias Sendok Plastik Bekas"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Kategori</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="kerajinan">Kerajinan Tangan</option>
                    <option value="pertanian">Kompos / Tanaman</option>
                    <option value="alat_tulis">Alat Tulis Meja</option>
                    <option value="fashion">Tas & Aksesoris</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Asal Bahan Sampah Daur Ulang</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: 10 botol plastik PET 600ml & cat akrilik sisa"
                  value={newProductMaterial}
                  onChange={(e) => setNewProductMaterial(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Estimasi Stok Tersedia</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Deskripsi & Keunggulan Produk</label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan bahan, kegunaan, dan keunikan kerajinan kelasmu..."
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600 resize-none"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                  <AlertCircle size={13} className="text-amber-600 shrink-0" />
                  <span>Kebijakan Kurasi Adiwiyata</span>
                </div>
                <p>
                  Seluruh karya harus higienis, ramah lingkungan, dan aman digunakan sebelum disetujui koordinator bank sampah.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitProductModalOpen(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Kirim Draf Karya
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
