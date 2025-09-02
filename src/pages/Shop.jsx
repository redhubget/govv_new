// src/pages/Shop.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Shop Page
 * - Lists accessories from /public/accessories/
 * - Allows adding to cart (stored in localStorage)
 */
export default function Shop() {
  // Dummy accessories
  const products = [
    { id: 1, name: "Helmet", price: 1200, img: "/accessories/helmet.png" },
    { id: 2, name: "Phone Holder", price: 800, img: "/accessories/holder.png" },
    { id: 3, name: "LED Light", price: 600, img: "/accessories/light.png" },
    { id: 4, name: "Mount", price: 500, img: "/accessories/mount.png" },
    { id: 5, name: "U-Lock", price: 900, img: "/accessories/ulock.png" },
  ];

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const addToCart = (item) => {
    const newCart = [...cart, item];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    alert(`${item.name} added to cart`);
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: 16 }}>Accessories</h2>

      <div className="grid" style={{ gap: 16 }}>
        {products.map((p) => (
          <div className="card" key={p.id} style={{ gridColumn: "span 6" }}>
            <img
              src={p.img}
              alt={p.name}
              style={{ width: "100%", borderRadius: 12 }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <b>{p.name}</b>
              <span>₹{p.price}</span>
            </div>
            <button
              style={{ marginTop: 8 }}
              onClick={() => addToCart(p)}
              className="btn-primary"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart link */}
      <div style={{ marginTop: 20, textAlign: "right" }}>
        <Link to="/cart" className="badge">
          🛒 View Cart ({cart.length})
        </Link>
      </div>
    </div>
  );
}
