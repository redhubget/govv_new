import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div
      className="container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "70vh",
      }}
    >
      <div style={{ fontSize: 64, color: "#22c55e" }}>✅</div>
      <h2 style={{ marginTop: 16 }}>Order Placed Successfully!</h2>
      <p style={{ marginTop: 8, color: "var(--muted)" }}>
        Thank you for shopping with Go VV.  
        Your items will be delivered soon.
      </p>

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <Link to="/home" className="badge">
          🏠 Back to Home
        </Link>
        <Link to="/activities" className="badge">
          📦 View Orders (dummy)
        </Link>
      </div>
    </div>
  );
}
