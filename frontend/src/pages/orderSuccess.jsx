import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import { CartContext } from "../context/cartContext";

function OrderSuccess() {
    const { clearCart } = useContext(CartContext);

  useEffect(() => {
    // Payment completed → clear frontend cart
    clearCart();
  }, [clearCart]);
  return (
    <main className="order-success-page">

      <div className="order-success-card">

        <div className="success-icon">
          ✓
        </div>

        <p className="success-eyebrow">
          PAYMENT SUCCESSFUL
        </p>

        <h1>
          Thank You for Your Order!
        </h1>

        <p className="success-message">
          Your payment has been successfully
          processed. Your order is now being
          prepared.
        </p>

        <div className="success-info">

          <div>
            <span>
              Payment Status
            </span>

            <strong>
              Paid ✓
            </strong>
          </div>

          <div>
            <span>
              Order Status
            </span>

            <strong>
              Processing
            </strong>
          </div>

        </div>

         {/* ACTION BUTTONS */}
        <div className="success-actions">

          <Link
            to="/orders"
            className="success-primary-button"
          >
            View My Orders →
          </Link>

          <Link
            to="/products"
            className="success-secondary-button"
          >
            Continue Shopping →
          </Link>

        </div>
      </div>

    </main>
  );
}

export default OrderSuccess;