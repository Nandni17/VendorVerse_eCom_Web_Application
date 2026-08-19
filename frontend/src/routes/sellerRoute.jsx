import { Navigate, Outlet } from "react-router-dom";

function SellerRoute() {
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Invalid user data");

    localStorage.removeItem("user");
  }

  // Not logged in
  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not seller
  if (user.role !== "seller") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default SellerRoute;