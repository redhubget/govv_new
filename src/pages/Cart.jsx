import { useCart } from "../store/cart";
import { Link } from "react-router-dom";

export default function Cart() {
  const { items, updateQty, removeItem, clearCart } = useCart();
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  return (
    <div className="container">
      <h2 style={{ marginBottom: 16 }}>Your Cart</h2>

      {items.length === 0 ? (
        <div className="card">
          Cart is empty. <Link to="/shop">Go to Shop</Link>
        </div>
      ) : (
        <div className="grid" style={{ gap: 16 }}>
          {items.map((it) => (
            <div key={it.id} className="card" style={{ display: "flex", gap: 16 }}>
              <img src={it.img} alt={it.name} style={{ width: 80, height: 80, borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{it.name}</div>
                <div>₹{it.price}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                  <button onClick={() => updateQty(it.id, it.qty - 1)}>-</button>
                  <span>{it.qty}</span>
                  <button onClick={() => updateQty(it.id, it.qty + 1)}>+</button>
                  <button
                    onClick={() => removeItem(it.id)}
                    style={{ marginLeft: "auto" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="card" style={{ textAlign: "right", fontWeight: 600 }}>
            Subtotal: ₹{subtotal}
          </div>
          <div style={{ textAlign: "right" }}>
            <button
              onClick={clearCart}
              style={{
                marginRight: 8,
                background: "#ef4444",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: 8,
              }}
            >
              Clear Cart
            </button>
            <Link to="/checkout">
              <button
                style={{
                  background: "#22c55e",
                  color: "#fff",
                  padding: "8px 14px",
                  borderRadius: 8,
                }}
              >
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}


