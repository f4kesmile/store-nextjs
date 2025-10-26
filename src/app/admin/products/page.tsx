// src/app/admin/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Variant {
  id?: number;
  name: string;
  value: string;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  enableNotes?: boolean;
  variants: Variant[];
}

export default function ProductsManagement() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [managingProductVariants, setManagingProductVariants] =
    useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    iconUrl: "",
    price: "",
    stock: "",
    status: "ACTIVE",
    enableNotes: true,
  });
  const [variants, setVariants] = useState<Variant[]>([]);
  const [newVariant, setNewVariant] = useState({
    name: "",
    value: "",
    stock: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?admin=true");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const payload = {
        ...formData,
        variants: variants.map((v) => ({
          name: v.name,
          value: v.value,
          stock: parseInt(v.stock.toString()),
        })),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchProducts();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      iconUrl: product.iconUrl,
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status,
      enableNotes: product.enableNotes ?? true,
    });
    setVariants(product.variants || []);
    setShowModal(true);
  };

  const addVariant = () => {
    if (!newVariant.name || !newVariant.value) {
      alert("Nama dan value variant harus diisi!");
      return;
    }
    setVariants([
      ...variants,
      {
        name: newVariant.name,
        value: newVariant.value,
        stock: parseInt(newVariant.stock) || 0,
      },
    ]);
    setNewVariant({ name: "", value: "", stock: "" });
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariantStock = (index: number, newStock: number) => {
    const updated = [...variants];
    updated[index].stock = newStock;
    setVariants(updated);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      iconUrl: "",
      price: "",
      stock: "",
      status: "ACTIVE",
      enableNotes: true,
    });
    setVariants([]);
  };

  const openVariantManager = (product: Product) => {
    setManagingProductVariants(product);
    setVariants(product.variants || []);
    setShowVariantModal(true);
  };

  const saveVariants = async () => {
    if (!managingProductVariants) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/products/${managingProductVariants.id}/variants`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variants }),
        }
      );

      if (res.ok) {
        await fetchProducts();
        setShowVariantModal(false);
        setManagingProductVariants(null);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Produk</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
        >
          ➕ Tambah Produk
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                Gambar
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                Nama
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                Harga
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                Stok
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                Variants
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img
                    src={product.iconUrl || "https://via.placeholder.com/80"}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold">{product.name}</div>
                  <div className="text-sm text-gray-600 line-clamp-1">
                    {product.description}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-purple-600">
                  Rp {Number(product.price).toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {product.variants?.length || 0} variant
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      product.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 flex-wrap">
                    {/* Show Variant button ONLY if product has variants */}
                    {product.variants && product.variants.length > 0 && (
                      <button
                        onClick={() => openVariantManager(product)}
                        className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                      >
                        🎨 Variants ({product.variants.length})
                      </button>
                    )}

                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Create/Edit Product */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? "Edit Produk" : "Tambah Produk"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Produk
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Deskripsi
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  URL Gambar
                </label>
                <input
                  type="url"
                  value={formData.iconUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, iconUrl: e.target.value })
                  }
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Harga
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stok Utama
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full border rounded-lg p-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full border rounded-lg p-3"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="enableNotes"
                    checked={formData.enableNotes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        enableNotes: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                  <label
                    htmlFor="enableNotes"
                    className="flex-1 cursor-pointer"
                  >
                    <span className="font-medium">Aktifkan Kolom Catatan</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Customer dapat menambahkan catatan khusus untuk produk ini
                    </p>
                  </label>
                </div>
              </div>

              {/* Variant Management */}
              <div className="border-t pt-4">
                <h3 className="font-bold mb-3">Variants Produk</h3>

                {/* Add Variant Form */}
                <div className="bg-gray-50 p-4 rounded-lg mb-3">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Nama (Size, Color, dll)"
                      value={newVariant.name}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, name: e.target.value })
                      }
                      className="border rounded p-2"
                    />
                    <input
                      type="text"
                      placeholder="Value (XL, Red, dll)"
                      value={newVariant.value}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, value: e.target.value })
                      }
                      className="border rounded p-2"
                    />
                    <input
                      type="number"
                      placeholder="Stok"
                      value={newVariant.stock}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, stock: e.target.value })
                      }
                      className="border rounded p-2"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  >
                    ➕ Tambah Variant
                  </button>
                </div>

                {/* Variants List */}
                {variants.length > 0 && (
                  <div className="space-y-2">
                    {variants.map((variant, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-white p-3 rounded border"
                      >
                        <span className="flex-1">
                          <strong>{variant.name}:</strong> {variant.value}
                        </span>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) =>
                            updateVariantStock(index, parseInt(e.target.value))
                          }
                          className="w-20 border rounded px-2 py-1"
                        />
                        <span className="text-sm text-gray-600">stok</span>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
                >
                  {loading ? "Saving..." : editingProduct ? "Update" : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Variant Manager */}
      {showVariantModal && managingProductVariants && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              Kelola Variants: {managingProductVariants.name}
            </h2>

            <div className="space-y-3 mb-6">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-bold">
                      {variant.name}: {variant.value}
                    </p>
                    <p className="text-sm text-gray-600">
                      Stok: {variant.stock}
                    </p>
                  </div>
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariantStock(index, parseInt(e.target.value) || 0)
                    }
                    className="w-24 border rounded px-3 py-2"
                  />
                  <button
                    onClick={() => removeVariant(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveVariants}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
              >
                {loading ? "Saving..." : "Simpan Perubahan"}
              </button>
              <button
                onClick={() => {
                  setShowVariantModal(false);
                  setManagingProductVariants(null);
                }}
                className="px-6 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
