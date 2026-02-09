import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, X, ShoppingBag, Package, DollarSign, Boxes, Search, CheckCircle, AlertCircle } from 'lucide-react';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    quantity: ''
  });

  const API_BASE = 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      showNotification('Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      if (modalMode === 'create') {
        const response = await fetch(`${API_BASE}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          showNotification('Product created successfully!', 'success');
          await fetchProducts();
        }
      } else {
        const response = await fetch(`${API_BASE}/products/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          showNotification('Product updated successfully!', 'success');
          await fetchProducts();
        }
      }

      closeModal();
    } catch (error) {
      showNotification(`Failed to ${modalMode} product`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        showNotification('Product deleted successfully!', 'success');
        await fetchProducts();
      }
    } catch (error) {
      showNotification('Failed to delete product', 'error');
    } finally {
      setLoading(false);
      setDeleteConfirm(null);
    }
  };

  const openCreateModal = () => {
    setFormData({ id: '', name: '', description: '', price: '', quantity: '' });
    setModalMode('create');
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString()
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ id: '', name: '', description: '', price: '', quantity: '' });
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow-x: hidden;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .glass-card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card-hover:hover {
          transform: translateY(-4px);
          border-color: rgba(6, 182, 212, 0.3);
          box-shadow: 0 20px 60px rgba(6, 182, 212, 0.15), 0 0 40px rgba(6, 182, 212, 0.1);
        }

        .gradient-text {
          background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-primary {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .btn-primary:hover::before {
          left: 100%;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(6, 182, 212, 0.4);
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-card {
          animation: slideUp 0.6s ease-out forwards;
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; opacity: 0; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; opacity: 0; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; opacity: 0; }

        .product-card {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }

        .product-card:nth-child(1) { animation-delay: 0.1s; }
        .product-card:nth-child(2) { animation-delay: 0.15s; }
        .product-card:nth-child(3) { animation-delay: 0.2s; }
        .product-card:nth-child(4) { animation-delay: 0.25s; }
        .product-card:nth-child(5) { animation-delay: 0.3s; }
        .product-card:nth-child(6) { animation-delay: 0.35s; }

        .modal-overlay {
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          animation: modalSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes modalSlide {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #06b6d4;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        }

        .notification-enter {
          animation: slideInRight 0.4s ease-out;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .search-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .search-input:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: #06b6d4;
        }

        .backdrop-blur-xl {
          backdrop-filter: blur(24px);
        }

        .grid-bg {
          background-image: 
            linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>

      {/* Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 notification-enter">
          <div className={`glass-card rounded-xl px-6 py-4 flex items-center gap-3 min-w-[320px] ${
            notification.type === 'success' 
              ? 'border-l-4 border-emerald-500' 
              : 'border-l-4 border-red-500'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <span className="text-white font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative glass-card rounded-2xl p-8 max-w-md w-full mx-4 modal-content">
            <h3 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: 'Outfit' }}>
              Confirm Deletion
            </h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete "<span className="font-semibold text-white">{deleteConfirm.name}</span>"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 rounded-xl text-white font-medium glass-card hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative glass-card rounded-2xl p-8 max-w-2xl w-full mx-4 modal-content">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-white" style={{ fontFamily: 'Outfit' }}>
                {modalMode === 'create' ? 'Create New Product' : 'Edit Product'}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-card text-white placeholder-slate-500 transition-all"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-card text-white placeholder-slate-500 resize-none transition-all"
                  rows="3"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-card text-white placeholder-slate-500 transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-card text-white placeholder-slate-500 transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 rounded-xl text-white font-semibold glass-card hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-xl text-white font-semibold btn-primary disabled:opacity-50"
                >
                  {loading ? 'Saving...' : modalMode === 'create' ? 'Create Product' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid-bg">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12 fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl glass-card">
                <Package className="w-8 h-8 text-cyan-400" />
              </div>
              <h1 className="text-5xl font-bold gradient-text" style={{ fontFamily: 'Outfit' }}>
                Product Manager
              </h1>
            </div>
            <p className="text-slate-400 text-lg">
              Manage your inventory with precision and style
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="glass-card rounded-2xl p-6 stat-card">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20">
                  <ShoppingBag className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Products</p>
                  <p className="text-3xl font-bold text-white mt-1" style={{ fontFamily: 'Outfit' }}>
                    {products.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 stat-card">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20">
                  <Boxes className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Quantity</p>
                  <p className="text-3xl font-bold text-white mt-1" style={{ fontFamily: 'Outfit' }}>
                    {totalQuantity}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 stat-card">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Value</p>
                  <p className="text-3xl font-bold text-white mt-1" style={{ fontFamily: 'Outfit' }}>
                    ${totalValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 fade-in">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl search-input text-white placeholder-slate-500"
              />
            </div>
            <button
              onClick={openCreateModal}
              className="px-6 py-3.5 rounded-xl text-white font-semibold btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>

          {/* Products Grid */}
          {loading && products.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                {searchQuery ? 'No products found' : 'No products yet'}
              </h3>
              <p className="text-slate-500">
                {searchQuery ? 'Try a different search term' : 'Create your first product to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="glass-card glass-card-hover rounded-2xl p-6 product-card"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Outfit' }}>
                        {product.name}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 glass-card px-2 py-1 rounded-lg">
                      #{product.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">Price</p>
                      <p className="text-2xl font-bold text-cyan-400" style={{ fontFamily: 'Outfit' }}>
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">Stock</p>
                      <p className="text-2xl font-bold text-emerald-400" style={{ fontFamily: 'Outfit' }}>
                        {product.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex-1 px-4 py-2.5 rounded-xl glass-card hover:bg-white/10 text-white font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product)}
                      className="flex-1 px-4 py-2.5 rounded-xl glass-card hover:bg-red-500/20 text-red-400 font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
