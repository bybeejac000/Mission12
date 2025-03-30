import { createContext, ReactNode, useContext, useState } from 'react';
import { cart } from '../types/cart';

// Define the CartContextType interface to outline the structure of the cart context
interface CartContextType {
  cart: cart[]; // The current items in the cart
  addToCart: (item: cart) => void; // Function to add an item to the cart
  removeFromCart: (projectId: number) => void; // Function to remove an item from the cart
  clearCart: () => void; // Function to clear all items in the cart
}

// Create a context for the cart with an initial value of undefined
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // State to store the current cart items
  const [cart, setCart] = useState<cart[]>([]);

  // Function to add an item to the cart
  const addToCart = (item: cart) => {
    setCart((prevCart) => {
      // Check if the item is already in the cart
      const exisitingItem = prevCart.find((c) => c.bookId == item.bookId);

      // If the item exists, update its price; otherwise, add a new item
      const updatedCart = prevCart.map((c) =>
        c.bookId == item.bookId ? { ...c, price: c.price + item.price } : c
      );

      // Return the updated cart or the previous cart if the item doesn't exist
      return exisitingItem ? updatedCart : [...prevCart, item];
    });
  };

  // Function to remove an item from the cart based on its bookId
  const removeFromCart = (bookId: number) => {
    setCart((prevCart) => prevCart.filter((c) => c.bookId == bookId));
  };

  // Function to clear the cart (remove all items)
  const clearCart = () => {
    setCart(() => []); // Clear the cart by resetting the state
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children} {/* Render the children components */}
    </CartContext.Provider>
  );
};

// Custom hook to access the cart context
export const useCart = () => {
  const context = useContext(CartContext);

  // Throw an error if the hook is used outside of a CartProvider
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context; // Return the cart context
};
