import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import {
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
} from "../icons";

import { CartContext } from "../context/cartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  // =========================
  // EMPTY CART
  // =========================

  if (!cart || cart.length === 0) {
    return (
      <main className="cart-page">

        <div className="cart-header">
          <h1>Your Cart</h1>

          <p>
            Review your selected products before checkout.
          </p>
        </div>


        <div className="empty-cart">

          <div className="empty-cart-icon">
            <ShoppingCart
              size={48}
              strokeWidth={1.5}
            />
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Looks like you haven't added anything
            to your cart yet.
          </p>

          <button
            type="button"
            className="continue-shopping-button"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>

        </div>

      </main>
    );
  }


  // =========================
  // CART WITH PRODUCTS
  // =========================

  return (
    <main className="cart-page">

      {/* Header */}

      <div className="cart-header">

        <div>
          <h1>
            Your Cart
          </h1>

          <p>
            {cart.length}{" "}
            {cart.length === 1
              ? "item"
              : "items"}{" "}
            in your cart
          </p>
        </div>


        <button
          type="button"
          className="continue-shopping-link"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft
            size={17}
            strokeWidth={1.8}
          />

          <span>
            Continue Shopping
          </span>
        </button>

      </div>


      {/* Main Cart Layout */}

      <div className="cart-layout">

        {/* =========================
            CART ITEMS
        ========================= */}

        <section className="cart-items">

          {cart.map((item) => (

            <div
              className="cart-item"
              key={item._id}
            >

              {/* Image */}

              <div className="cart-item-image">

                <img
                  src={item.image}
                  alt={item.name}
                />

              </div>


              {/* Product Info */}

              <div className="cart-item-info">

                <span className="cart-item-category">
                  {item.category || "Product"}
                </span>

                <h2>
                  {item.name}
                </h2>

                <p className="cart-item-price">
                  ₹
                  {Number(
                    item.price
                  ).toLocaleString("en-IN")}
                </p>


                {/* Quantity */}

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item._id)
                    }
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus
                      size={15}
                      strokeWidth={2}
                    />
                  </button>


                  <span>
                    {item.quantity}
                  </span>


                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item._id)
                    }
                    disabled={
                      typeof item.stock === "number" &&
                      item.quantity >= item.stock
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus
                      size={15}
                      strokeWidth={2}
                    />
                  </button>

                </div>


                {typeof item.stock === "number" && (
                  <p className="cart-stock-message">

                    {item.quantity >= item.stock
                      ? "Maximum available quantity reached"
                      : `${item.stock - item.quantity} left in stock`}

                  </p>
                )}

              </div>


              {/* Right Side */}

              <div className="cart-item-right">

                <strong>
                  ₹
                  {(
                    Number(item.price) *
                    item.quantity
                  ).toLocaleString("en-IN")}
                </strong>


                <button
                  type="button"
                  className="remove-cart-button"
                  onClick={() =>
                    removeFromCart(item._id)
                  }
                >
                  <Trash2
                    size={16}
                    strokeWidth={1.8}
                  />

                  <span>
                    Remove
                  </span>
                </button>

              </div>

            </div>

          ))}

        </section>


        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <aside className="cart-summary">

          <h2>
            Order Summary
          </h2>


          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹
              {total.toLocaleString("en-IN")}
            </strong>

          </div>


          <div className="summary-row">

            <span>
              Shipping
            </span>

            <span className="free-shipping">
              FREE
            </span>

          </div>


          <div className="summary-divider"></div>


          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {total.toLocaleString("en-IN")}
            </strong>

          </div>


          <button
            type="button"
            className="checkout-button"
            onClick={() => navigate("/checkout")}
          >
            <span>
              Proceed to Checkout
            </span>

            <ArrowRight
              size={18}
              strokeWidth={1.8}
            />
          </button>

        </aside>

      </div>

    </main>
  );
}

export default Cart;