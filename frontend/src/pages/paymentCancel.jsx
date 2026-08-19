import { Link } from "react-router-dom";

function PaymentCancel() {
  return (
    <main className="payment-result-page">

      <div className="payment-result-card">

        <div className="payment-cancel-icon">
          ×
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
            Return to Checkout
          </Link>

          <Link
            to="/products"
            className="payment-secondary-button"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </main>
  );
}

export default PaymentCancel;