import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./CartContext";
import { ProductsProvider } from "./ProductsContext";
import { AuthProvider } from "./AuthContext";
import { SiteProvider } from "./SiteContext";
import { ToastProvider } from "./ToastContext";
import { App } from "./App";

const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <BrowserRouter>
      <CartProvider>
        <ProductsProvider>
          <AuthProvider>
            <SiteProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </SiteProvider>
          </AuthProvider>
        </ProductsProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
