import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get(
          "/api/admin/users"
        );

        setUsers(response.data || []);
      } catch (err) {
        console.error(
          "Admin users error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load customers."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

   const handleDeleteUser = async (userId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this customer?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await API.delete(
      `/admin/users/${userId}`
    );

    setUsers((prevUsers) =>
      prevUsers.filter(
        (user) => user._id !== userId
      )
    );
  } catch (err) {
    console.error(
      "Delete customer error:",
      err
    );

    setError(
      err.response?.data?.message ||
        "Unable to delete customer."
    );
  }
};

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-status">
          <div className="loader"></div>
          <p>Loading customers...</p>
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
            ADMIN • CUSTOMERS
          </p>

          <h1>
            Customers
          </h1>

          <p>
            View all registered buyer accounts.
          </p>
        </div>

      </section>


      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      <section className="admin-table-card">

        {users.length === 0 ? (
          <div className="admin-empty">
            <h2>No customers found</h2>
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

                {users.map((user) => (

                  <tr key={user._id}>

                    <td>
                      <strong>
                        {user.name}
                      </strong>
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      <span className="admin-badge buyer">
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "—"}
                    </td>

                    <td>
    <button
      type="button"
      className="admin-delete-button"
      onClick={() =>
        handleDeleteUser(user._id)
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

export default AdminUsers;