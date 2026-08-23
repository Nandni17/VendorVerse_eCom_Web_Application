import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import API from "../api/axios";
import { ArrowLeft, Check } from "../icons";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const response = await API.get(
          `/api/orders/${id}`
        );

        setOrder(response.data);
      } catch (err) {
        console.error(
          "Order details error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <main className="order-details-page">
        <div className="orders-status">
          <div className="loader"></div>
          <p>Loading order...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="order-details-page">
        <div className="orders-status">

          <h2>
            Order not found
          </h2>

          <p>
            {error}
          </p>

          <Link
            to="/orders"
            className="orders-shop-button"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="order-details-page">

      <div className="order-details-header">

        <Link
          to="/orders"
          className="back-orders-link"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </Link>

        <p className="section-eyebrow">
          ORDER DETAILS
        </p>

        <h1>
          Order #
          {order._id.slice(-8).toUpperCase()}
        </h1>

      </div>


      <section className="order-details-layout">

        {/* LEFT */}

        <div className="order-details-main">

          <div className="order-detail-card">

            <div className="order-detail-card-header">

              <h2>
                Order Items
              </h2>

              <span
                className="order-status-badge"
              >
                {order.orderStatus || "Processing"}
              </span>

            </div>


            <div className="order-detail-items">

              {order.orderItems?.map((item) => (

                <div
                  className="order-detail-item"
                  key={
                    item._id ||
                    item.product?._id
                  }
                >

                  <div className="order-detail-image">

                    {item.product?.image && (
                      <img
                        src={item.product.image}
                        alt={
                          item.product.name
                        }
                      />
                    )}

                  </div>


                  <div className="order-detail-product">

                    <h3>
                      {item.product?.name ||
                        "Product"}
                    </h3>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                    {item.product?.price && (
                      <p>
                        ₹
                        {Number(
                          item.product.price
                        ).toLocaleString("en-IN")}
                      </p>
                    )}

                  </div>

                </div>

              ))}

            </div>

          </div>


          <div className="order-detail-card">

            <h2>
              Order Timeline
            </h2>

            <div className="order-timeline">

              <div className="timeline-step active">
                <span>
                  <Check size={16} />
                </span>

                <div>
                  <strong>
                    Order Placed
                  </strong>

                  <p>
                    Your order has been received.
                  </p>
                </div>
              </div>


              <div
                className={`timeline-step ${
                  ["processing", "shipped", "delivered"].includes(
                    order.orderStatus?.toLowerCase()
                  )
                    ? "active"
                    : ""
                }`}
              >
                <span>
                  <Check size={16} />
                </span>

                <div>
                  <strong>
                    Processing
                  </strong>

                  <p>
                    Your order is being prepared.
                  </p>
                </div>
              </div>


              <div
                className={`timeline-step ${
                  ["shipped", "delivered"].includes(
                    order.orderStatus?.toLowerCase()
                  )
                    ? "active"
                    : ""
                }`}
              >
                <span>
                  <Check size={16} />
                </span>

                <div>
                  <strong>
                    Shipped
                  </strong>

                  <p>
                    Your order is on its way.
                  </p>
                </div>
              </div>


              <div
                className={`timeline-step ${
                  order.orderStatus?.toLowerCase() ===
                  "delivered"
                    ? "active"
                    : ""
                }`}
              >
                <span>
                  <Check size={16} />
                </span>

                <div>
                  <strong>
                    Delivered
                  </strong>

                  <p>
                    Order delivered successfully.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>


        {/* RIGHT */}

        <aside className="order-details-summary">

          <div className="order-detail-card">

            <h2>
              Order Summary
            </h2>

            <div className="order-summary-row">

              <span>
                Payment
              </span>

              <strong className="paid-text">
                {order.paymentStatus || "Pending"}
              </strong>

            </div>


            <div className="order-summary-row">

              <span>
                Order Status
              </span>

              <strong>
                {order.orderStatus || "Processing"}
              </strong>

            </div>


            <div className="order-summary-divider"></div>


            <div className="order-summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {Number(
                  order.totalPrice || 0
                ).toLocaleString("en-IN")}
              </strong>

            </div>

          </div>


          <Link
            to="/products"
            className="orders-shop-button full"
          >
            Continue Shopping →
          </Link>

        </aside>

      </section>

    </main>
  );
}

export default OrderDetails;