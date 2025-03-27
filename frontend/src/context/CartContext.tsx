import {
  Children,
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';
import { cart } from '../types/cart';
interface CartContextType {
  cart: cart[];
  addToCart: (item: cart) => void;
  removeFromCart: (projectId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<cart[]>([]);
  const addToCart = (item: cart) => {
    setCart((prevCart) => {
      const exisitingItem = prevCart.find((c) => c.bookId == item.bookId);
      const updatedCart = prevCart.map((c) =>
        c.bookId == item.bookId ? { ...c, price: c.price + item.price } : c
      );
      return exisitingItem ? updatedCart : [...prevCart, item];
    });
  };
  const removeFromCart = (bookId: number) => {
    setCart((prevCart) => prevCart.filter((c) => c.bookId == bookId));
  };
  const clearCart = () => {
    setCart(() => []);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must ebes used within a CartProvider');
  }
  return context;
};
