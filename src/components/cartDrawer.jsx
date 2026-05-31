import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartDrawer.css";

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      <div
        className={`cart-overlay ${open ? "cart-overlay--visible" : ""}`}
        onClick={onClose}
      />
      <div className={`cart-drawer ${open ? "cart-drawer--open" : ""}`}>
        <div className="cart-drawer__header">
          <h2>Your Cart ({cart.length})</h2>
          <button className="cart-drawer__close" onClick={onClose}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-drawer__empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <p>Your cart is empty</p>
            <button className="cart-drawer__continue" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item__image"
                  />
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.name}</p>
                    {(item.selectedSize || item.selectedColor) && (
                      <p className="cart-item__variant">
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedSize && item.selectedColor && " · "}
                        {item.selectedColor && <span>{item.selectedColor}</span>}
                      </p>
                    )}
                    <p className="cart-item__price">
                      ${(item.price * (item.quantity || 1)).toFixed(2)}
                      {(item.quantity || 1) > 1 && (
                        <span className="cart-item__unit">
                          (${item.price} x {item.quantity})
                        </span>
                      )}
                    </p>
                    <div className="cart-item__qty">
                      <button
                        onClick={() =>
                          item.quantity === 1
                            ? removeFromCart(item.id)
                            : updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="cart-item__remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__total">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
              <button
                className="cart-drawer__checkout"
                onClick={handleCheckout}
              >
                Proceed to Checkout →
              </button>
              <button className="cart-drawer__clear" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}