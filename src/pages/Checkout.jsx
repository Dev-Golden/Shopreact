import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { PaystackButton } from "react-paystack";
import { db, auth } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./Checkout.css";

const PAYSTACK_KEY = "pk_test_fda2dba63544326466647b9dffccf3abf5320de0";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaystackSuccess = async (reference) => {
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, "orders", user.uid, "myorders"), {
        reference: reference.reference,
        items: cart,
        total: totalPrice,
        shipping: form,
        status: "Processing",
        estimatedDelivery: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000
        ).toDateString(),
        createdAt: serverTimestamp(),
      });
    }
    clearCart();
    navigate("/order-success");
  };

  const handlePaystackClose = () => {
    alert("Payment cancelled. Your order has not been placed.");
  };

  if (cart.length === 0) {
    return (
      <div className="checkout__empty">
        <h2>Your cart is empty</h2>
        <Link to="/">← Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout__container">
        <Link to="/" className="checkout__back">← Back to Shop</Link>
        <h1 className="checkout__title">Checkout</h1>

        <div className="checkout__steps">
          <div className={`checkout__step ${step >= 1 ? "active" : ""}`}>
            <span>1</span> Shipping
          </div>
          <div className="checkout__step-line" />
          <div className={`checkout__step ${step >= 2 ? "active" : ""}`}>
            <span>2</span> Payment
          </div>
        </div>

        <div className="checkout__layout">
          <div className="checkout__form">

            {step === 1 && (
              <div className="checkout__section">
                <h2>Shipping Information</h2>
                <div className="checkout__row">
                  <div className="checkout__field">
                    <label>First Name</label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="John"
                    />
                  </div>
                  <div className="checkout__field">
                    <label>Last Name</label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="checkout__field">
                  <label>Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    type="email"
                  />
                </div>
                <div className="checkout__field">
                  <label>Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="checkout__row">
                  <div className="checkout__field">
                    <label>City</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Lagos"
                    />
                  </div>
                  <div className="checkout__field">
                    <label>State</label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Lagos State"
                    />
                  </div>
                  <div className="checkout__field">
                    <label>ZIP</label>
                    <input
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      placeholder="100001"
                    />
                  </div>
                </div>
                <button
                  className="checkout__next-btn"
                  onClick={() => {
                    if (!form.firstName || !form.email || !form.address) {
                      alert("Please fill in all required fields");
                      return;
                    }
                    setStep(2);
                  }}
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="checkout__section">
                <h2>Payment</h2>
                <div className="checkout__paystack-info">
                  <div className="checkout__paystack-amount">
                    ₦{Number(totalPrice).toLocaleString()}
                  </div>
                  <p>You will be charged the amount above</p>
                  <p>Secured by <strong>Paystack</strong> 🔐</p>
                </div>
                <div className="checkout__shipping-review">
                  <h3>Shipping To</h3>
                  <p>{form.firstName} {form.lastName}</p>
                  <p>{form.address}, {form.city}, {form.state}</p>
                  <p>{form.email}</p>
                </div>
                <div className="checkout__btn-row">
                  <button
                    className="checkout__back-btn"
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </button>
                  <PaystackButton
                    className="checkout__paystack-btn"
                    text="Pay Now with Paystack 🔐"
                    email={form.email}
                    amount={parseFloat(totalPrice) * 100}
                    publicKey={PAYSTACK_KEY}
                    currency="NGN"
                    onSuccess={handlePaystackSuccess}
                    onClose={handlePaystackClose}
                  />
                </div>
                <p className="checkout__secure-note">
                  🔒 Your payment is 100% secure. We never store your card details.
                </p>
              </div>
            )}
          </div>

          <div className="checkout__summary">
            <h2>Order Summary</h2>
            <div className="checkout__summary-items">
              {cart.map((item) => (
                <div key={item.id} className="checkout__summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="checkout__summary-info">
                    <p>{item.name}</p>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <p>₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="checkout__summary-totals">
              <div className="checkout__summary-row">
                <span>Subtotal</span>
                <span>₦{Number(totalPrice).toLocaleString()}</span>
              </div>
              <div className="checkout__summary-row">
                <span>Shipping</span>
                <span className="checkout__free">Free</span>
              </div>
              <div className="checkout__summary-row checkout__summary-total">
                <span>Total</span>
                <span>₦{Number(totalPrice).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}