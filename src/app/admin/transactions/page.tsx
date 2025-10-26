// src/app/admin/transactions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Transaction {
  id: number;
  productId: number;
  product: {
    name: string;
  };
  variant?: {
    name: string;
    value: string;
  };
  reseller?: {
    name: string;
  };
  customerName: string | null;
  customerPhone: string | null;
  quantity: number;
  totalPrice: number;
  status: string;
  notes: string | null;
  createdAt: string;
}

export default function TransactionsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    notes: "",
    customerName: "",
    customerPhone: "",
  });

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter]);

  const fetchTransactions = async () => {
    try {
      let url = "/api/transactions";
      if (statusFilter !== "ALL") {
        url += `?status=${statusFilter}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      status: transaction.status,
      notes: transaction.notes || "",
      customerName: transaction.customerName || "",
      customerPhone: transaction.customerPhone || "",
    });
    setShowModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/transactions/${editingTransaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchTransactions();
        setShowModal(false);
        setEditingTransaction(null);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchTransactions();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch("/api/transactions/export");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to export transactions");
    }
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.product.name.toLowerCase().includes(filter.toLowerCase()) ||
      t.customerName?.toLowerCase().includes(filter.toLowerCase()) ||
      t.id.toString().includes(filter)
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-700",
      CONFIRMED: "bg-blue-100 text-blue-700",
      SHIPPED: "bg-purple-100 text-purple-700",
      COMPLETED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";
  };

  const calculateStats = () => {
    const total = transactions.length;
    const totalRevenue = transactions
      .filter((t) => t.status !== "CANCELLED")
      .reduce((sum, t) => sum + parseFloat(t.totalPrice.toString()), 0);
    const pending = transactions.filter((t) => t.status === "PENDING").length;
    const completed = transactions.filter(
      (t) => t.status === "COMPLETED"
    ).length;

    return { total, totalRevenue, pending, completed };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manajemen Transaksi
          </h1>
          <p className="text-gray-600 mt-1">Kelola semua transaksi penjualan</p>
        </div>
        <button
          onClick={handleExport}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold flex items-center gap-2"
        >
          📥 Export ke Excel
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-sm text-gray-600 mb-1">Total Transaksi</div>
          <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
          <div className="text-3xl font-bold text-green-600">
            Rp {stats.totalRevenue.toLocaleString("id-ID")}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-sm text-gray-600 mb-1">Pending</div>
          <div className="text-3xl font-bold text-yellow-600">
            {stats.pending}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-sm text-gray-600 mb-1">Completed</div>
          <div className="text-3xl font-bold text-blue-600">
            {stats.completed}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="🔍 Cari order ID, produk, atau customer..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Tanggal & Waktu
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Produk
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Reseller
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Qty
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Total
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
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-purple-600">
                      #{transaction.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800">
                      {new Date(transaction.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.createdAt).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }
                      )}{" "}
                      WIB
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium">
                      {transaction.product.name}
                    </div>
                    {transaction.variant && (
                      <div className="text-xs text-gray-600">
                        {transaction.variant.name}: {transaction.variant.value}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {transaction.customerName || "-"}
                    </div>
                    <div className="text-xs text-gray-600">
                      {transaction.customerPhone || "-"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {transaction.reseller?.name || "Direct"}
                  </td>

                  <td className="px-6 py-4">{transaction.quantity}</td>

                  <td className="px-6 py-4 font-bold text-green-600">
                    Rp{" "}
                    {parseFloat(
                      transaction.totalPrice.toString()
                    ).toLocaleString("id-ID")}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            Tidak ada transaksi yang ditemukan
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">
              Edit Transaksi #{editingTransaction.id}
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Customer
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  No. Telepon
                </label>
                <input
                  type="text"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                  className="w-full border rounded-lg p-3"
                />
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
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Catatan
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full border rounded-lg p-3"
                  placeholder="Tambahkan catatan untuk transaksi ini..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? "Saving..." : "Update"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTransaction(null);
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
    </div>
  );
}
