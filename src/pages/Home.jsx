import { useState, useMemo, useEffect } from "react";
import { products, categories } from "../data/products";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import Toast from "../components/Toast";
import "./Home.css";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    let result = products;
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [activeCategory, search, sort]);

  return (
    <main className="home">

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <section className="home__hero">
        <div className="home__hero-text">
          <h1>New Arrivals <span>2024</span></h1>
          <p>Discover premium products — from fashion to tech.</p>
          <button
            onClick={() =>
              document.getElementById("products").scrollIntoView({ behavior: "smooth" })
            }
          >
            Shop Now →
          </button>
        </div>
      </section>

      <section className="home__controls" id="products">
        <div className="home__search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="home__search"
          />
          {search && (
            <button className="home__search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <div className="home__filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`home__filter-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          className="home__sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </section>

      {!loading && (
        <div className="home__results-count">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
        </div>
      )}

      {loading ? (
        <section className="home__grid">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </section>
      ) : filtered.length === 0 ? (
        <div className="home__empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>No products match your search.</p>
          <button onClick={() => { setSearch(""); setActiveCategory("All"); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <section className="home__grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}

    </main>
  );
}