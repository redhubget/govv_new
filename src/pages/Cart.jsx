// src/pages/Cart.jsx
import { useState, useEffect } from "react";

/**
 * Cart Page
 * - Displays items added to cart
 * - Allows removing items and shows total price
 */
export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const removeFromCart = (id) => {
    const newCart = cart.filter((item, idx) => idx !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container">
      <h2 style={{ marginBottom: 16 }}>Your Cart</h2>

      {cart.length === 0 ? (
        <div>No items in cart</div>
      ) : (
        <div className="grid" style={{ gap: 16 }}>
          {cart.map((item, idx) => (
            <div
              className="card"
              key={idx}
              style={{ gridColumn: "span 12", display: "flex", gap: 12 }}
            >
              <img
                src={item.img}
                alt={item.name}
                style={{ width: 80, height: 80, borderRadius: 8 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div>₹{item.price}</div>
                <button
                  onClick={() => removeFromCart(idx)}
                  className="btn-ghost"
                  style={{ marginTop: 6 }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Total */}
          <div
            className="card"
            style={{
              gridColumn: "span 12",
              textAlign: "right",
              fontWeight: 600,
            }}
          >
            Total: ₹{total}
          </div>
        </div>
      )}
    </div>
  );
}
