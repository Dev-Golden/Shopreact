import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartDrawer from "./CartDrawer";
import "./Navbar.css";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar__logo">ShopReact</Link>

        {/* Desktop links */}
        <div className="navbar__links">
          <Link to="/">Shop</Link>
          {user && <Link to="/wishlist">Wishlist</Link>}
          {user && <Link to="/orders">Orders</Link>}
          {user ? (
            <div className="navbar__user">
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=1a1a2e&color=fff`}
                alt="avatar"
                className="navbar__avatar"
              />
              <button className="navbar__logout" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="navbar__login-btn">Login</Link>
          )}
        </div>

        <div className="navbar__right">
          <button className="navbar__cart-btn" onClick={() => setDrawerOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && <span className="navbar__cart-count">{totalItems}</span>}
          </button>

          {/* Hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={menuOpen ? "open" : ""} />
            <span className={menuOpen ? "open" : ""} />
            <span className={menuOpen ? "open" : ""} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>Shop</Link>
          {user && <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>}
          {user && <Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>}
          {user ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}