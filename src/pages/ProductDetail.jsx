import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return (
    <div className="pd-notfound">
      <h2>Product not found</h2>
      <Link to="/">← Back to Shop</Link>
    </div>
  );

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart({ ...product, selectedSize, selectedColor, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pd">
      <div className="pd__container">

        <div className="pd__breadcrumb">
          <Link to="/">Shop</Link>
          <span>›</span>
          <span>{product.category}</span>
          <span>›</span>
          <span>{product.name}</span>
        </div>

        <div className="pd__layout">

          {/* Left — Images */}
          <div className="pd__images">
            <div className="pd__main-image">
              <img src={images[selectedImage]} alt={product.name} />
            </div>
            {images.length > 1 && (
              <div className="pd__thumbnails">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`pd__thumb ${selectedImage === i ? "pd__thumb--active" : ""}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt={`view ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div className="pd__info">
            <span className="pd__category">{product.category}</span>
            <h1 className="pd__name">{product.name}</h1>

            <div className="pd__rating">
              <div className="pd__stars">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} width="16" height="16" viewBox="0 0 24 24"
                    fill={s <= Math.round(product.rating) ? "#f5a623" : "none"}
                    stroke="#f5a623" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <span className="pd__reviews">{product.rating} · {product.reviews} reviews</span>
            </div>

            <p className="pd__price">
              ${(product.price * quantity).toFixed(2)}
              {quantity > 1 && (
                <span className="pd__unit-price"> (${product.price} each)</span>
              )}
            </p>

            <p className="pd__description">{product.description}</p>

            {product.colors.length > 0 && (
              <div className="pd__section">
                <p className="pd__section-label">
                  Color: <strong>{selectedColor || "Select a color"}</strong>
                </p>
                <div className="pd__colors">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`pd__color-btn ${selectedColor === color ? "pd__color-btn--active" : ""}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div className="pd__section">
                <p className="pd__section-label">
                  Size: <strong>{selectedSize || "Select a size"}</strong>
                </p>
                <div className="pd__sizes">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`pd__size-btn ${selectedSize === size ? "pd__size-btn--active" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pd__section">
              <p className="pd__section-label">Quantity:</p>
              <div className="pd__qty">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>

            <button
              className={`pd__add-btn ${added ? "pd__add-btn--added" : ""}`}
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {!product.inStock
                ? "Out of Stock"
                : added
                ? "✓ Added to Cart!"
                : user
                ? "Add to Cart"
                : "Login to Add to Cart"}
            </button>

            <p className={`pd__stock ${product.inStock ? "pd__stock--in" : "pd__stock--out"}`}>
              {product.inStock ? "✓ In Stock — Ready to ship" : "✗ Out of Stock"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}