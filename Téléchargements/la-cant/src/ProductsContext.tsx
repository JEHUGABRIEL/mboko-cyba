import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Product } from "./data";
import { products as initialProducts } from "./data";

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  getProduct: (id: number) => Product | undefined;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

const STORAGE_KEY = "lacant_products";

function loadProducts(): Product[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return initialProducts;
}

let nextId = (() => {
  const loaded = loadProducts();
  return loaded.length > 0
    ? Math.max(...loaded.map((p) => p.id)) + 1
    : 10;
})();

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(loadProducts);

  // Persist to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback((productData: Omit<Product, "id">) => {
    const newProduct: Product = { ...productData, id: nextId++ };
    setProducts((prev) => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback((id: number, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getProduct = useCallback(
    (id: number) => products.find((p) => p.id === id),
    [products]
  );

  return (
    <ProductsContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
