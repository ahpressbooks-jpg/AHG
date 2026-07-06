import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CartItem } from '../types';

interface CartContextValue {
  items: CartItem[];
  cartOpen: boolean;
  toastMessage: string | null;
  checkoutDone: boolean;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  checkout: () => void;
  dismissCheckout: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  }, []);

  const addItem = useCallback(
    (item: CartItem) => {
      setItems((prev) => [...prev, item]);
      showToast(`Added ${item.title} to your plate.`);
    },
    [showToast],
  );

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const checkout = useCallback(() => {
    setCartOpen(false);
    setItems([]);
    setCheckoutDone(true);
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);

  const value: CartContextValue = {
    items,
    cartOpen,
    toastMessage,
    checkoutDone,
    subtotal,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    addItem,
    removeItem,
    checkout,
    dismissCheckout: () => setCheckoutDone(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
