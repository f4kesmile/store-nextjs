// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalResellers: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, resellersRes] = await Promise.all([
        fetch("/api/products?admin=true"),
        fetch("/api/resellers"),
      ]);

      const products = await productsRes.json();
      const resellers = await resellersRes.json();

      setStats({
        totalProducts: products.length,
        activeProducts: products.filter((p: any) => p.status === "ACTIVE")
          .length,
        totalResellers: resellers.length,
        totalUsers: 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Produk",
      value: stats.totalProducts,
      icon: "📦",
      color: "bg-blue-500",
    },
    {
      title: "Produk Aktif",
      value: stats.activeProducts,
      icon: "✅",
      color: "bg-green-500",
    },
    {
      title: "Total Reseller",
      value: stats.totalResellers,
      icon: "👥",
      color: "bg-purple-500",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👤",
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">
          Welcome back, {session?.user.name}! Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {stat.title}
                </p>
                <h3 className="text-4xl font-bold text-gray-800 mt-2">
                  {stat.value}
                </h3>
              </div>
              <div
                className={`${stat.color} text-white text-4xl p-4 rounded-full`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => (window.location.href = "/admin/products")}
            className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            <div className="text-3xl mb-2">➕</div>
            <div className="font-bold">Tambah Produk</div>
          </button>
          <button
            onClick={() => (window.location.href = "/admin/resellers")}
            className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="font-bold">Kelola Reseller</div>
          </button>
          <button
            onClick={() => (window.location.href = "/admin/transactions")}
            className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
          >
            <div className="text-3xl mb-2">💳</div>
            <div className="font-bold">Lihat Transaksi</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-medium">System initialized successfully</p>
              <p className="text-sm text-gray-600">Just now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
