import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import { CartContext } from "../context/cartContext";
import {
  CheckCircle,
  Check,
  ArrowRight,
} from "../icons";

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
          <CheckCircle
            size={64}
            strokeWidth={1.5}
          />
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
              Paid{" "}
              <Check
                size={16}
                strokeWidth={2.5}
              />
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
            View My Orders
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/products"
            className="success-secondary-button"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>

        </div>

      </div>

    </main>
  );
}

export default OrderSuccess;