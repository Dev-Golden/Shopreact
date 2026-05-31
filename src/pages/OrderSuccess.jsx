import { Link } from "react-router-dom";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  return (
    <div className="success">
      <div className="success__card">
        <div className="success__icon">🎉</div>
        <h1>Order Placed!</h1>
        <p>
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <div className="success__actions">
          <Link to="/" className="success__btn">
            Continue Shopping
          </Link>
          <Link to="/orders" className="success__btn success__btn--outline">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}