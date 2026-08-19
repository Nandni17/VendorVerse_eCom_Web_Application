import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Account() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/login");

    window.location.reload();
  };


  // If user somehow visits /account without login
  if (!user) {

    return (
      <main className="account-page">

        <div className="account-container">

          <div className="account-icon-large">
            👤
          </div>

          <p className="account-eyebrow">
            VENDORVERSE ACCOUNT
          </p>

          <h1>
            Login Required
          </h1>

          <p>
            Please login to view your account.
          </p>

          <button
            className="account-primary-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

        </div>

      </main>
    );
  }


  return (

    <main className="account-page">

      <div className="account-container">


        {/* HEADER */}

        <div className="account-header">

          <div className="account-icon-large">
            👤
          </div>

          <div>

            <p className="account-eyebrow">
              VENDORVERSE ACCOUNT
            </p>

            <h1>
              My Account
            </h1>

            <p>
              Manage your profile, orders and wishlist.
            </p>

          </div>

        </div>


        {/* PROFILE */}

        <section className="account-card">

          <div className="account-card-header">

            <div>
              <p className="card-eyebrow">
                PROFILE
              </p>

              <h2>
                Personal Information
              </h2>
            </div>

            <span className="card-icon">
              👤
            </span>

          </div>


          <div className="profile-info">

            <div className="profile-item">

              <span>
                Name
              </span>

              <strong>
                {user.name}
              </strong>

            </div>


            <div className="profile-item">

              <span>
                Email
              </span>

              <strong>
                {user.email}
              </strong>

            </div>


            <div className="profile-item">

              <span>
                Account Type
              </span>

              <strong className="role-badge">
                {user.role || "buyer"}
              </strong>

            </div>

          </div>

        </section>


        {/* ACCOUNT OPTIONS */}

        <section className="account-options">


          {/* ORDERS */}

          <button
            className="account-option"
            onClick={() => navigate("/orders")}
          >

            <div className="option-icon">
              📦
            </div>

            <div className="option-content">

              <h3>
                My Orders
              </h3>

              <p>
                View your previous and current orders.
              </p>

            </div>

            <span className="option-arrow">
              →
            </span>

          </button>


          {/* WISHLIST */}

          <button
            className="account-option"
            onClick={() => navigate("/wishlist")}
          >

            <div className="option-icon">
              ♡
            </div>

            <div className="option-content">

              <h3>
                My Wishlist
              </h3>

              <p>
                View products you saved for later.
              </p>

            </div>

            <span className="option-arrow">
              →
            </span>

          </button>


          {/* LOGOUT */}

          <button
            className="account-option logout-option"
            onClick={handleLogout}
          >

            <div className="option-icon">
              ↪
            </div>

            <div className="option-content">

              <h3>
                Logout
              </h3>

              <p>
                Sign out of your VendorVerse account.
              </p>

            </div>

            <span className="option-arrow">
              →
            </span>

          </button>


        </section>

      </div>

    </main>
  );
}

export default Account;