// src/app/page.tsx - UPDATE bagian navbar dan footer
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-purple-600">
            Store Saya
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-purple-600 font-bold"
            >
              Beranda
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-purple-600"
            >
              Produk
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-purple-600"
            >
              Kontak
            </Link>
            <Link
              href="/login"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Login Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6 text-gray-800">
          Selamat Datang di <span className="text-purple-600">Store Saya</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Platform digital terpercaya untuk semua kebutuhan produk premium dan
          layanan sosial media.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/products"
            className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-purple-700 font-bold transition-all"
          >
            🛍️ Belanja Sekarang
          </Link>
          <Link
            href="/contact"
            className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-4 rounded-lg text-lg hover:bg-purple-50 font-bold transition-all"
          >
            📞 Hubungi Kami
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">
              Cepat & Aman
            </h3>
            <p className="text-gray-600">
              Transaksi cepat dengan sistem keamanan terpercaya
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all">
            <div className="text-5xl mb-4">💎</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">
              Produk Premium
            </h3>
            <p className="text-gray-600">
              Koleksi produk digital berkualitas tinggi
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">
              Support 24/7
            </h3>
            <p className="text-gray-600">
              Tim support siap membantu kapan saja
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
