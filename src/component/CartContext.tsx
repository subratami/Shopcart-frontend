import { createContext, useContext, useEffect, useState,type ReactNode } from "react";
import { authFetch } from "../utils/authFetch";

// --- Inline Types ---
interface CartItem {
  product_id: string;
  brand?: string;
  model?: string;
  color?: string;
  memory?: string;
  storage?: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
  subtotal: number;
}

interface CartData {
  items: CartItem[]
  coupon: string | null;
  discount_total: number;
  final_total: number;
}

interface CartContextType {
  cart: CartData;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (product_id: string, quantity?: number, productInfo?: { brand: string; model: string; color: string; memory: string; storage: string; price: number; image?: string; description?: string }) => Promise<void>;
  updateCartItem: (product_id: string, quantity: number) => Promise<void>;
  removeFromCart: (product_id: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  checkout: () => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartData>({
    items: [],
    coupon: null,
    discount_total: 0,
    final_total: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));

  useEffect(() => {
    const checkLogin = () => setIsLoggedIn(!!localStorage.getItem("access_token"));
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, [isLoggedIn]);

  // 🔄 Auto-persist guest cart
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("guest_cart", JSON.stringify(cart));
    }
  }, [cart, isLoggedIn]);

  // 🛍 Fetch cart based on auth state
  async function fetchCart() {
    setLoading(true);
    try {
      if (isLoggedIn) {
        const res = await authFetch("/api/cart");
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        console.log("🛒 Cart response:", data);
        setCart(data);
      } else {
        const guest = localStorage.getItem("guest_cart");
        if (guest) {
          setCart(JSON.parse(guest));
        }
      }
    } catch {
      setCart({ items: [], coupon: null, discount_total: 0, final_total: 0 });
    }
    setLoading(false);
  }

  async function addToCart(
    product_id: string,
    quantity: number = 1,
    productInfo?: { brand: string; model: string; color: string; memory: string; storage: string; price: number; image?: string; description?: string }
  ) {
    if (isLoggedIn) {
      await authFetch("/api/cart/add", {
        method: "POST",
        body: JSON.stringify({ product_id, quantity }),
      });
      await fetchCart();
    } else {
      const existing = [...cart.items];
      const index = existing.findIndex((i) => i.product_id === product_id);
      if (index !== -1) {
        existing[index].quantity += quantity;
        existing[index].subtotal = existing[index].quantity * existing[index].price;
      } else {
        existing.push({
          product_id,
          brand: productInfo?.brand || "Unknown",
          model: productInfo?.model || "Unknown",
          color: productInfo?.color || "unknown",
          memory: productInfo?.memory || "unknown",
          storage: productInfo?.storage || "unknown",
          price: productInfo?.price || 0,
          image: productInfo?.image || "",
          description: productInfo?.description || "",
          quantity,
          subtotal: (productInfo?.price || 0) * quantity,
        });
      }

      const final_total = existing.reduce((t, i) => t + i.subtotal, 0);
      const updatedCart = {
        ...cart,
        items: existing,
        final_total,
        discount_total: 0,
      };
      setCart(updatedCart);
    localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
  
    }
  }

  async function updateCartItem(product_id: string, quantity: number) {
    if (isLoggedIn) {
      await authFetch("/api/cart/update", {
        method: "PUT",
        body: JSON.stringify({ product_id, quantity }),
      });
      await fetchCart();
    } else {
      const updated = cart.items.map((item) =>
        item.product_id === product_id
          ? { ...item, quantity, subtotal: item.price * quantity }
          : item
      );
      const final_total = updated.reduce((t, i) => t + i.subtotal, 0);
      setCart({
        ...cart,
        items: updated,
        final_total,
        discount_total: 0,
      });
    }
  }

  async function removeFromCart(product_id: string) {
    if (isLoggedIn) {
      await authFetch("/api/cart/remove", {
        method: "DELETE",
        body: JSON.stringify({ product_id }),
      });
      await fetchCart();
    } else {
      const updated = cart.items.filter((item) => item.product_id !== product_id);
      const final_total = updated.reduce((t, i) => t + i.subtotal, 0);
      setCart({
        ...cart,
        items: updated,
        final_total,
        discount_total: 0,
      });
    }
  }

  async function applyCoupon(code: string) {
    if (!isLoggedIn) return;
    await authFetch("/api/cart/coupon", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    await fetchCart();
  }

  async function checkout() {
    if (!isLoggedIn) return { message: "Please log in to checkout." };
    const res = await authFetch("/api/checkout", { method: "POST" });
    await fetchCart();
    return res.json();
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        applyCoupon,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

{/*export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartData>({
    items: [],
    coupon: null,
    discount_total: 0,
    final_total: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  async function fetchCart() {
    setLoading(true);
    try {
      const res = await authFetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data);
    } catch {
      setCart({ items: [], coupon: null, discount_total: 0, final_total: 0 });
    }
    setLoading(false);
  }

  async function addToCart(product_id: string, quantity: number = 1) {
    await authFetch("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({ product_id, quantity }),
    });
    await fetchCart();
  }

  async function updateCartItem(product_id: string, quantity: number) {
    await authFetch("/api/cart/update", {
      method: "PUT",
      body: JSON.stringify({ product_id, quantity }),
    });
    await fetchCart();
  }

  async function removeFromCart(product_id: string) {
    await authFetch("/api/cart/remove", {
      method: "DELETE",
      body: JSON.stringify({ product_id }),
    });
    await fetchCart();
  }

  async function applyCoupon(code: string) {
    await authFetch("/api/cart/coupon", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    await fetchCart();
  }

  async function checkout() {
    const res = await authFetch("/api/checkout", { method: "POST" });
    await fetchCart();
    return res.json();
  }
console.log("🧾 Cart from context:", cart);
  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        applyCoupon,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
} */}
