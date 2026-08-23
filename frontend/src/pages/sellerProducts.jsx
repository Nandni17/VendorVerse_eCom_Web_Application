import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Package,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Star,
} from "../icons";

import API from "../api/axios";

function SellerProducts() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/api/products/my");

      setProducts(response.data);
    } catch (err) {
      console.error("Seller products error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load your products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await API.delete(`/api/products/${productId}`);

      // Remove from UI immediately
      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) =>
            product._id !== productId
        )
      );
    } catch (err) {
      console.error(
        "Delete product error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to delete product."
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="seller-products-page">

        <div className="seller-products-status">

          <div className="loader"></div>

          <p>
            Loading your products...
          </p>

        </div>

      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <main className="seller-products-page">

        <div className="seller-products-status error">

          <h2>
            Unable to load products
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={fetchProducts}
            className="seller-retry-button"
          >
            Try Again
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="seller-products-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="seller-products-header">

        <div>

          <Link
            to="/seller"
            className="seller-orders-back"
          >
            <ArrowLeft
              size={18}
              strokeWidth={1.8}
            />

            <span>
              Seller Dashboard
            </span>
          </Link>

          <p className="section-eyebrow">
            SELLER CENTER
          </p>

          <h1>
            My Products
          </h1>

          <p>
            Manage the products you've listed
            on VendorVerse.
          </p>

        </div>

        <Link
          to="/seller/products/add"
          className="seller-add-product-button"
        >
          <Plus
            size={18}
            strokeWidth={1.8}
          />

          <span>
            Add Product
          </span>
        </Link>

      </section>


      {/* =========================
          PRODUCT COUNT
      ========================= */}

      <div className="seller-products-meta">

        <span>
          {products.length}{" "}
          {products.length === 1
            ? "product"
            : "products"}
        </span>

      </div>


      {/* =========================
          EMPTY STATE
      ========================= */}

      {products.length === 0 ? (

        <div className="seller-products-empty">

          <div className="seller-empty-icon">
            <Package
              size={40}
              strokeWidth={1.5}
            />
          </div>

          <h2>
            You haven't listed any products yet.
          </h2>

          <p>
            Add your first product and start
            selling on VendorVerse.
          </p>

          <Link
            to="/seller/products/add"
            className="seller-add-product-button"
          >
            <Plus
              size={18}
              strokeWidth={1.8}
            />

            <span>
              Add Your First Product
            </span>
          </Link>

        </div>

      ) : (

        /* =========================
           PRODUCTS TABLE
        ========================= */

        <section className="seller-products-card">

          <div className="seller-products-table-wrapper">

            <table className="seller-products-table">

              <thead>

                <tr>

                  <th>
                    Product
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Stock
                  </th>

                  <th>
                    Rating
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {products.map((product) => (

                  <tr key={product._id}>

                    {/* PRODUCT */}

                    <td>

                      <div className="seller-product-cell">

                        <div className="seller-product-image">

                          <img
                            src={product.image}
                            alt={product.name}
                          />

                        </div>

                        <div>

                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            {product.brand ||
                              "No brand"}
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* CATEGORY */}

                    <td>
                      {product.category ||
                        "Uncategorized"}
                    </td>


                    {/* PRICE */}

                    <td>

                      <strong>
                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString("en-IN")}
                      </strong>

                    </td>


                    {/* STOCK */}

                    <td>

                      <span
                        className={`seller-stock-badge ${
                          product.stock === 0
                            ? "out"
                            : product.stock <= 5
                            ? "low"
                            : "available"
                        }`}
                      >
                        {product.stock === 0
                          ? "Out of stock"
                          : `${product.stock} in stock`}
                      </span>

                    </td>


                    {/* RATING */}

                    <td>

                      <span className="seller-rating">

                        <Star
                          size={16}
                          strokeWidth={1.8}
                          fill="currentColor"
                        />

                        <span>
                          {product.rating || 0}
                        </span>

                        <small>
                          (
                          {product.numReviews ||
                            0}
                          )
                        </small>

                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="seller-product-actions">

                        <Link
                          to={`/seller/products/edit/${product._id}`}
                          className="seller-edit-button"
                        >
                          <Pencil
                            size={16}
                            strokeWidth={1.8}
                          />

                          <span>
                            Edit
                          </span>
                        </Link>

                        <button
                          type="button"
                          className="seller-delete-button"
                          onClick={() =>
                            handleDelete(
                              product._id
                            )
                          }
                        >
                          <Trash2
                            size={16}
                            strokeWidth={1.8}
                          />

                          <span>
                            Delete
                          </span>
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>

      )}

    </main>
  );
}

export default SellerProducts;