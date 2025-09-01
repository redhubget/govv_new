import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./components/Home";
import Splash from "./components/Splash";
import BikeDetails from "./components/BikeDetails";
import History from "./components/History";
import Shop from "./components/Shop";
import Cart from "./components/Cart";
import Warranty from "./components/Warranty";
import WarrantyTerms from "./components/WarrantyTerms";
import ServiceCenters from "./components/ServiceCenters";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="bike/:id" element={<BikeDetails />} />
          <Route path="history" element={<History />} />
          <Route path="shop" element={<Shop />} />
          <Route path="cart" element={<Cart />} />
          <Route path="warranty" element={<Warranty />} />
          <Route path="warranty/terms" element={<WarrantyTerms />} />
          <Route path="service-centers" element={<ServiceCenters />} />
          <Route path="splash" element={<Splash />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


