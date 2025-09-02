import { useCart } from "../store/cart";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  const handlePlaceOrder = () => {
    clearCart();
    navigate("/order-success"); // ✅ redirect instead of alert
  };

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="card">Your cart is empty. Go to Shop.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Checkout</h2>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>Order Summary</h3>
        {items.map((it) => (
          <div key={it.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span>{it.name} × {it.qty}</span>
            <span>₹{it.price * it.qty}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, fontWeight: 600 }}>Total: ₹{subtotal}</div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Delivery Info</h3>
        <input placeholder="Full Name" style={{ width: "100%", marginTop: 8, padding: 8, borderRadius: 8 }} />
        <input placeholder="Address" style={{ width: "100%", marginTop: 8, padding: 8, borderRadius: 8 }} />
        <input placeholder="Phone" style={{ width: "100%", marginTop: 8, padding: 8, borderRadius: 8 }} />
      </div>

      <button
        onClick={handlePlaceOrder}
        style={{
          marginTop: 20,
          background: "#3b82f6",
          color: "#fff",
          padding: "10px 16px",
          borderRadius: 8,
          width: "100%",
        }}
      >
        Place Order
      </button>
    </div>
  );
}

