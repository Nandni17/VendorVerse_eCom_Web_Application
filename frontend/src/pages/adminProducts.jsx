import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get(
          "/api/admin/products"
        );

        setProducts(response.data || []);
      } catch (err) {
        console.error(
          "Admin products error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

const handleDeleteProduct = async (productId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmed) return;

  try {
    await API.delete(
      `/api/admin/products/${productId}`
    );

    setProducts((prev) =>
      prev.filter(
        (product) =>
          product._id !== productId
      )
    );
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Unable to delete product."
    );
  }
};

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-status">
          <div className="loader"></div>
          <p>Loading products...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">

      <section className="admin-header">

        <div>
          <Link
            to="/admin"
            className="admin-back-link"
          >
            ← Admin Dashboard
          </Link>

          <p className="section-eyebrow">
            ADMIN • PRODUCTS
          </p>

          <h1>
            Products
          </h1>

          <p>
            Monitor all products listed on the marketplace.
          </p>
        </div>

      </section>


      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      <section className="admin-table-card">

        {products.length === 0 ? (

          <div className="admin-empty">
            <h2>No products found</h2>
          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Seller</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {products.map((product) => (

                  <tr key={product._id}>

                    <td>

                      <div className="admin-product-cell">

                        <div className="admin-product-image">

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

                    <td>
                      {product.seller?.name ||
                        "Unknown"}
                    </td>

                    <td>
                      {product.category ||
                        "Uncategorized"}
                    </td>

                    <td>
                      <strong>
                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </td>

                    <td>

                      <span
                        className={`admin-stock-badge ${
                          Number(product.stock) === 0
                            ? "out"
                            : Number(product.stock) <= 5
                            ? "low"
                            : "available"
                        }`}
                      >
                        {product.stock}
                      </span>

                    </td>
                    <td>
                      <button
                        className="admin-delete-button"
                        onClick={() =>
                          handleDeleteProduct(product._id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>
  );
}

export default AdminProducts;