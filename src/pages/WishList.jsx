import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import "./Wishlist.css";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    addToCart({ ...item, quantity: 1 });
    navigate("/");
  };

  return (
    <div className="wishlist">
      <div className="wishlist__container">
        <div className="wishlist__header">
          <h1>My Wishlist</h1>
          <span>{wishlist.length} item{wishlist.length !== 1 ? "s" : ""}</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="wishlist__empty">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <p>Your wishlist is empty</p>
            <Link to="/">Browse Products</Link>
          </div>
        ) : (
          <div className="wishlist__grid">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-card">
                <Link to={`/product/${item.id}`} className="wishlist-card__image-wrap">
                  <img src={item.image} alt={item.name} />
                </Link>
                <div className="wishlist-card__body">
                  <span className="wishlist-card__category">{item.category}</span>
                  <Link to={`/product/${item.id}`} className="wishlist-card__name">
                    {item.name}
                  </Link>
                  <p className="wishlist-card__price">${item.price}</p>
                  <div className="wishlist-card__actions">
                    <button
                      className="wishlist-card__cart-btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="wishlist-card__remove-btn"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}