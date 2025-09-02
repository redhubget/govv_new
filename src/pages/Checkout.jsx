import { useCart } from "../store/cart";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Checkout() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    card: "",
  });

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.address || !form.card) {
      alert("Please fill all fields.");
      return;
    }

    alert("✅ Order placed successfully!");
    clearCart();
    navigate("/home");
  };

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="card">Your cart is empty. Go back to shop!</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: 16 }}>Checkout</h2>

      {/* Order Summary */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Order Summary</h3>
        <ul>
          {items.map((it) => (
            <li key={it.id}>
              {it.name} × {it.qty} — ₹{it.price * it.qty}
            </li>
          ))}
        </ul>
        <div style={{ fontWeight: 600, marginTop: 8 }}>Total: ₹{subtotal}</div>
      </div>

      {/* Checkout Form */}
      <form className="card" onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <h3>Billing Info</h3>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />

        <textarea
          name="address"
          placeholder="Delivery Address"
          value={form.address}
          onChange={handleChange}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", minHeight: 80 }}
        />

        <input
          type="text"
          name="card"
          placeholder="Card Number"
          value={form.card}
          onChange={handleChange}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />

        <button
          type="submit"
          style={{
            background: "#22c55e",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 8,
            fontWeight: "600",
          }}
        >
          Confirm & Pay
        </button>
      </form>
    </div>
  );
}
