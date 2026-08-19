import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";

function AdminSellers() {
  const [sellers, setSellers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await API.get(
          "/api/admin/sellers"
        );

        setSellers(response.data || []);
      } catch (err) {
        console.error(
          "Admin sellers error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load sellers."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

 const handleDeleteSeller = async (sellerId) => {
  const confirmed = window.confirm(
    "Delete this seller and all of their products?"
  );

  if (!confirmed) return;

  try {
    await API.delete(
      `/api/admin/sellers/${sellerId}`
    );

    setSellers((prev) =>
      prev.filter(
        (seller) => seller._id !== sellerId
      )
    );
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Unable to delete seller."
    );
  }
};

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-status">
          <div className="loader"></div>
          <p>Loading sellers...</p>
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
            ADMIN • SELLERS
          </p>

          <h1>
            Sellers
          </h1>

          <p>
            Manage sellers registered on VendorVerse.
          </p>
        </div>

      </section>


      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      <section className="admin-table-card">

        {sellers.length === 0 ? (
          <div className="admin-empty">
            <h2>No sellers found</h2>
          </div>
        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {sellers.map((seller) => (

                  <tr key={seller._id}>

                    <td>
                      <strong>
                        {seller.name}
                      </strong>
                    </td>

                    <td>
                      {seller.email}
                    </td>

                    <td>
                      <span className="admin-badge seller">
                        Seller
                      </span>
                    </td>

                    <td>
                      {seller.createdAt
                        ? new Date(
                            seller.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "—"}
                    </td>

                    <td>
                      <button
                        className="admin-delete-button"
                        onClick={() =>
                          handleDeleteSeller(seller._id)
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

export default AdminSellers;