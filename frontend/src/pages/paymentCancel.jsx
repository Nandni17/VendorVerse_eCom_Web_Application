import { Link } from "react-router-dom";

import {
  XCircle,
  ArrowLeft,
  ArrowRight,
} from "../icons";

function PaymentCancel() {
  return (
    <main className="payment-result-page">

      <div className="payment-result-card">

        <div className="payment-cancel-icon">
          <XCircle
            size={64}
            strokeWidth={1.5}
          />
        </div>

        <p className="section-eyebrow cancel">
          PAYMENT CANCELLED
        </p>

        <h1>
          Your Payment Was Cancelled
        </h1>

        <p>
          No payment was completed. Your cart
          is still available so you can try again.
        </p>

        <div className="payment-result-actions">

          <Link
            to="/checkout"
            className="payment-primary-button"
          >
            <ArrowLeft size={18} />
            Return to Checkout
          </Link>

          <Link
            to="/products"
            className="payment-secondary-button"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>

        </div>

      </div>

    </main>
  );
}

export default PaymentCancel;