import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import Toast from "./Toast";
import "./ProductCard.css";

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "#f5a623" : "none"}
          stroke="#f5a623" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="stars__count">({rating})</span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const wished = isInWishlist(product.id);
  const [toast, setToast] = useState(null);

  const handleAddToCart = () => {
    if (!user) { navigate("/login"); return; }
    addToCart({ ...product, quantity: 1 });
    setToast({ message: `${product.name} added to cart!`, type: "success" });
  };

  const handleWishlist = () => {
    if (!user) { navigate("/login"); return; }
    if (wished) {
      removeFromWishlist(product.id);
      setToast({ message: "Removed from wishlist", type: "error" });
    } else {
      addToWishlist(product);
      setToast({ message: "Added to wishlist ❤️", type: "success" });
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="product-card">
        <Link to={`/product/${product.id}`} className="product-card__image-wrap">
          <img src={product.image} alt={product.name} className="product-card__image" loading="lazy" />
          {!product.inStock && <span className="product-card__badge">Out of Stock</span>}
          <span className="product-card__category">{product.category}</span>
          <button
            className={`product-card__wish ${wished ? "product-card__wish--active" : ""}`}
            onClick={(e) => { e.preventDefault(); handleWishlist(); }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"
              fill={wished ? "#e94560" : "none"}
              stroke={wished ? "#e94560" : "#888"}
              strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
        </Link>
        <div className="product-card__body">
          <Link to={`/product/${product.id}`} className="product-card__name">{product.name}</Link>
          <Stars rating={product.rating} />
          <div className="product-card__footer">
            <span className="product-card__price">₦{product.price.toLocaleString()}</span>
            <button
              className="product-card__add-btn"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {product.inStock ? "Add to Cart" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}