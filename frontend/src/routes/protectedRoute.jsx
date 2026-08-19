import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
  const location = useLocation();

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Invalid authentication data.");

    localStorage.removeItem("user");
  }

  // User is not logged in
  if (!user?.token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // User is logged in
  return <Outlet />;
}

export default ProtectedRoute;