import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/cartContext";

function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);

  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
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
          <p>Review your selected products before checkout.</p>
        </div>

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>Your cart is empty</h2>

          <p>
            Looks like you haven't added anything to your cart yet.
          </p>

          <button
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
          <h1>Your Cart</h1>

          <p>
            {cart.length}{" "}
            {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <button
          className="continue-shopping-link"
          onClick={() => navigate("/products")}
        >
          ← Continue Shopping
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
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </p>


                {/* Quantity */}

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item._id)}
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                <button
  type="button"
  onClick={() => increaseQuantity(item._id)}
  disabled={
    typeof item.stock === "number" &&
    item.quantity >= item.stock
  }
>
  +
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
                    Number(item.price) * item.quantity
                  ).toLocaleString("en-IN")}
                </strong>

                <button
                  type="button"
                  className="remove-cart-button"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
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
              ₹{total.toLocaleString("en-IN")}
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
              ₹{total.toLocaleString("en-IN")}
            </strong>

          </div>

          <button
            className="checkout-button"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
            <span>→</span>
          </button>

        </aside>

      </div>

    </main>
  );
}

export default Cart;