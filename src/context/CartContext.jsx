/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect, useRef } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }
      return [...state, { ...action.payload }];
    }
    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload);
    case "UPDATE_QUANTITY":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    case "CLEAR_CART":
      return [];
    case "SET_CART":
      return action.payload;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const currentUserRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Save previous user cart before switching
        if (currentUserRef.current && currentUserRef.current !== user.uid) {
          const previousCart = JSON.parse(
            localStorage.getItem(`cart_${currentUserRef.current}`) || "[]"
          );
          localStorage.setItem(
            `cart_${currentUserRef.current}`,
            JSON.stringify(previousCart)
          );
        }

        // Load new user cart
        currentUserRef.current = user.uid;
        const saved = localStorage.getItem(`cart_${user.uid}`);
        if (saved) {
          dispatch({ type: "SET_CART", payload: JSON.parse(saved) });
        } else {
          dispatch({ type: "CLEAR_CART" });
        }
      } else {
        // User logged out — save cart first then clear
        if (currentUserRef.current) {
          const currentCart = JSON.parse(
            localStorage.getItem(`cart_${currentUserRef.current}`) || "[]"
          );
          localStorage.setItem(
            `cart_${currentUserRef.current}`,
            JSON.stringify(currentCart)
          );
        }
        currentUserRef.current = null;
        dispatch({ type: "CLEAR_CART" });
      }
    });
    return unsubscribe;
  }, []);

  // Save cart to localStorage every time it changes
  useEffect(() => {
    if (currentUserRef.current) {
      localStorage.setItem(
        `cart_${currentUserRef.current}`,
        JSON.stringify(cart)
      );
    }
  }, [cart]);

  const addToCart = (product) =>
    dispatch({ type: "ADD_TO_CART", payload: product });

  const removeFromCart = (id) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: id });

  const updateQuantity = (id, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });

  const clearCart = () => {
    if (currentUserRef.current) {
      localStorage.removeItem(`cart_${currentUserRef.current}`);
    }
    dispatch({ type: "CLEAR_CART" });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart
    .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
    .toFixed(2);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}