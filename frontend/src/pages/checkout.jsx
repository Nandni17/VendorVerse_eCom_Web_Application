import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CreditCard,
  DollarSign,
  Shield,
} from "../icons";

import { CartContext } from "../context/cartContext";
import API from "../api/axios";

function Checkout() {
  const { cart, clearCart } =
    useContext(CartContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("stripe");


  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // =========================
  // TOTAL
  // =========================

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        item.quantity,
    0
  );


  // =========================
  // CHECKOUT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(
      "PAY BUTTON CLICKED"
    );

    console.log(
      "CART:",
      cart
    );

    try {
      setLoading(true);
      setError("");


      // =========================
      // ORDER ITEMS
      // =========================

      const orderItems = cart.map(
        (item) => ({
          product: item._id,
          quantity: item.quantity,
        })
      );


      // =========================
      // COD
      // =========================

      if (
        paymentMethod === "cod"
      ) {
        const response =
          await API.post(
            "/api/orders",
            {
              orderItems,
              paymentMethod: "cod",
            }
          );

        console.log(
          "COD order created:",
          response.data
        );


        // Clear cart after
        // successful COD order

        clearCart();

        navigate("/orders");

        return;
      }


      // =========================
      // STRIPE
      // =========================

      console.log(
        "Sending order items:",
        orderItems
      );

      const response =
        await API.post(
          "/api/payment/create-checkout-session",
          {
            orderItems,
          }
        );

      console.log(
        "Stripe response:",
        response.data
      );


      // Stripe Checkout URL

      const stripeUrl =
        response.data.url;

      if (!stripeUrl) {
        throw new Error(
          "Stripe checkout URL was not returned."
        );
      }


      console.log(
        "REDIRECTING TO:",
        stripeUrl
      );


      // Redirect to Stripe

      window.location.href =
        stripeUrl;

    } catch (err) {
      console.error(
        "Checkout error:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          err.response?.data
            ?.error ||
          err.message ||
          "Unable to start payment."
      );

      setLoading(false);
    }
  };


  // =========================
  // EMPTY CART
  // =========================

  if (
    !cart ||
    cart.length === 0
  ) {
    return (
      <main className="checkout-page">

        <div className="checkout-empty">

          <h1>
            Your Cart is Empty
          </h1>

          <p>
            Add some products before
            proceeding to checkout.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
            className="checkout-shop-button"
          >
            Continue Shopping
          </button>

        </div>

      </main>
    );
  }


  return (
    <main className="checkout-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="checkout-header">

        <p className="checkout-eyebrow">
          VENDORVERSE CHECKOUT
        </p>

        <h1>
          Complete Your{" "}
          <span>Order</span>
        </h1>

        <p>
          Enter your details and
          continue to secure payment.
        </p>

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="checkout-error">
          {error}
        </div>
      )}


      <div className="checkout-container">

        {/* =========================
            CUSTOMER INFORMATION
        ========================= */}

        <section className="checkout-form-card">

          <h2>
            Shipping Information
          </h2>


          <form
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
              />

            </div>


            {/* PHONE */}

            <div className="form-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="03XX XXXXXXX"
                required
              />

            </div>


            {/* ADDRESS */}

            <div className="form-group">

              <label>
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                rows="4"
                required
              />

            </div>


            {/* CITY + POSTAL */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Karachi"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Postal Code
                </label>

                <input
                  type="text"
                  name="postalCode"
                  value={
                    formData.postalCode
                  }
                  onChange={handleChange}
                  placeholder="74000"
                  required
                />

              </div>

            </div>


            {/* =========================
                PAYMENT METHOD
            ========================= */}

            <div className="payment-method-section">

              <h3>
                Payment Method
              </h3>


              {/* STRIPE */}

              <label className="payment-option">

                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={
                    paymentMethod ===
                    "stripe"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span className="payment-option-content">

                  <CreditCard
                    size={18}
                    strokeWidth={1.8}
                  />

                  <span>
                    Pay with Stripe
                  </span>

                </span>

              </label>


              {/* COD */}

              <label className="payment-option">

                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={
                    paymentMethod ===
                    "cod"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span className="payment-option-content">

                  <DollarSign
                    size={18}
                    strokeWidth={1.8}
                  />

                  <span>
                    Cash on Delivery
                  </span>

                </span>

              </label>

            </div>


            {/* =========================
                PAY BUTTON
            ========================= */}

            <button
              type="submit"
              className="place-order-button"
              disabled={loading}
            >

              {loading ? (

                paymentMethod ===
                "cod"
                  ? "Placing Order..."
                  : "Redirecting to Stripe..."

              ) : (

                <>

                  {paymentMethod ===
                  "cod" ? (
                    <>
                      <DollarSign
                        size={18}
                        strokeWidth={1.8}
                      />

                      <span>
                        Place COD Order
                      </span>
                    </>
                  ) : (
                    <>
                      <CreditCard
                        size={18}
                        strokeWidth={1.8}
                      />

                      <span>
                        Pay with Stripe
                      </span>
                    </>
                  )}

                </>

              )}

            </button>

          </form>

        </section>


        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <section className="checkout-summary">

          <h2>
            Order Summary
          </h2>


          <div className="checkout-products">

            {cart.map((item) => (

              <div
                className="checkout-product"
                key={item._id}
              >

                <img
                  src={item.image}
                  alt={item.name}
                />


                <div className="checkout-product-info">

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    Quantity:{" "}
                    {item.quantity}
                  </p>

                </div>


                <strong>
                  ₹
                  {(
                    Number(item.price) *
                    item.quantity
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            ))}

          </div>


          {/* TOTAL */}

          <div className="checkout-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>


          {/* SECURE CHECKOUT */}

          <div className="secure-checkout">

            <Shield
              size={17}
              strokeWidth={1.8}
            />

            <span>
              Secure Checkout
            </span>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Checkout;