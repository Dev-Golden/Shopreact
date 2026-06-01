import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { auth } from "../firebase/config";
import { Link } from "react-router-dom";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const q = query(
            collection(db, "orders", user.uid, "myorders"),
            orderBy("createdAt", "desc")
          );
          const snapshot = await getDocs(q);
          setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
          console.error("Error fetching orders:", err);
        }
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="orders__loading"><p>Loading your orders...</p></div>;
  }

  return (
    <div className="orders">
      <div className="orders__container">
        <div className="orders__header">
          <h1>My Orders</h1>
          <Link to="/">← Back to Shop</Link>
        </div>

        {orders.length === 0 ? (
          <div className="orders__empty">
            <p>You have no orders yet.</p>
            <Link to="/">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders__list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card__header">
                  <div>
                    <p className="order-card__ref">Order #{order.reference}</p>
                    <p className="order-card__date">
                      Placed on {order.createdAt?.toDate().toDateString()}
                    </p>
                  </div>
                  <div className="order-card__right">
                    <span className={`order-card__status order-card__status--${order.status?.toLowerCase()}`}>
                      {order.status}
                    </span>
                    <p className="order-card__total">₦{Number(order.total).toLocaleString()}</p>
                  </div>
                </div>

                <div className="order-card__delivery">
                  🚚 Estimated Delivery: <strong>{order.estimatedDelivery}</strong>
                </div>

                <div className="order-card__items">
                  {order.items?.map((item) => (
                    <div key={item.id} className="order-card__item">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <p>{item.name}</p>
                        <span>Qty: {item.quantity} · ₦{item.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-card__shipping">
                  <p>📦 Shipping to: {order.shipping?.address}, {order.shipping?.city}, {order.shipping?.state}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}