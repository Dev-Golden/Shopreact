/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        // Listen to wishlist in Firestore in real time
        const wishlistRef = collection(db, "wishlists", user.uid, "items");
        const unsubscribeSnapshot = onSnapshot(wishlistRef, (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setWishlist(items);
        });
        return unsubscribeSnapshot;
      } else {
        setUserId(null);
        setWishlist([]);
      }
    });
    return unsubscribeAuth;
  }, []);

  const addToWishlist = async (product) => {
    if (!userId) return;
    const itemRef = doc(db, "wishlists", userId, "items", product.id);
    await setDoc(itemRef, {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating,
    });
  };

  const removeFromWishlist = async (productId) => {
    if (!userId) return;
    const itemRef = doc(db, "wishlists", userId, "items", productId);
    await deleteDoc(itemRef);
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}