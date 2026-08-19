import { createContext, useCallback,useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find(
        (item) => item._id === product._id
      );

      if (exists) {
        return prevCart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // =========================
  // REMOVE FROM CART
  // =========================

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => item._id !== productId
      )
    );
  };

  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  // =========================
// INCREASE QUANTITY
// =========================

const increaseQuantity = (productId) => {
  setCart((prevCart) =>
    prevCart.map((item) => {
      if (item._id !== productId) {
        return item;
      }

      // Don't exceed available stock
      if (
        typeof item.stock === "number" &&
        item.quantity >= item.stock
      ) {
        return item;
      }

      return {
        ...item,
        quantity: item.quantity + 1,
      };
    })
  );
};


// =========================
// DECREASE QUANTITY
// =========================

const decreaseQuantity = (productId) => {
  setCart((prevCart) =>
    prevCart
      .map((item) =>
        item._id === productId
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0)
  );
};
  // =========================
  // CLEAR CART
  // =========================

 const clearCart = useCallback(() => {
  setCart([]);
}, []);

  return (
    <CartContext.Provider
      value={{
         cart,
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};