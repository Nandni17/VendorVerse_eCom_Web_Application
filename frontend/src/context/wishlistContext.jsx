import { createContext, useState } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Add product to wishlist
  const addToWishlist = (product) => {
    const exists = wishlist.some(
      (item) => item._id === product._id
    );

    if (exists) {
      return;
    }

    setWishlist((prevWishlist) => [
      ...prevWishlist,
      product,
    ]);
  };

  // Remove product from wishlist
  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter(
        (item) => item._id !== productId
      )
    );
  };

  // Check whether product is already wishlisted
  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) => item._id === productId
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};