import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollToTop from "../components/scrollToTop";
import ProtectedRoute from "./protectedRoute";

import Home from "../pages/home";
import Products from "../pages/products";
import ProductDetails from "../pages/productDetails";
import Cart from "../pages/cart";
import Checkout from "../pages/checkout";
import Wishlist from "../pages/wishlist";
import Login from "../pages/login";
import Register from "../pages/register";
import Account from "../pages/account";
import Contact from "../pages/contact";
import Events from "../pages/events";
import FAQ from "../pages/faq";
import Orders from "../pages/orders";
import OrderDetails from "../pages/orderDetails";
import OrderSuccess from "../pages/orderSuccess";
import PaymentCancel from "../pages/paymentCancel";

//seller
import SellerRoute from "./sellerRoute";
import SellerDashboard from "../pages/sellerDashboard";
import SellerProducts from "../pages/sellerProducts";
import AddProduct from "../pages/addProduct";
import EditProduct from "../pages/editProduct";
import SellerOrders from "../pages/sellerOrders";

//Admin
import AdminRoute from "./adminRoute";

import AdminDashboard from "../pages/adminDashboard";
import AdminUsers from "../pages/adminUsers";
import AdminSellers from "../pages/adminSellers";
import AdminProducts from "../pages/adminProducts";
import AdminOrders from "../pages/adminOrders";
import AdminPayments from "../pages/adminPayments";
import AdminContacts from "../pages/adminContacts";

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Products */}
        <Route
          path="/products"
          element={<Products />}
        />

        <Route
  path="/contact"
  element={<Contact />}
/>

<Route
  path="/events"
  element={<Events />}
/>

<Route
  path="/faq"
  element={<FAQ />}
/>

          {/* Product Details */}
        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

       <Route element={<ProtectedRoute />}>

        {/* Cart */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* Checkout */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* Orders */}
        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* Order Details */}
        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />

          {/* Wishlist */}
        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

         {/* Account */}
        <Route
          path="/account"
          element={<Account />}
        />

         {/* Order Success */}
        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        {/* Payment Cancel */}
        <Route
          path="/payment-cancel"
          element={<PaymentCancel />}
        />

       </Route>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        //seller routes
        <Route
          path="/seller"
          element={<SellerDashboard />}
        />
        <Route
          path="/seller/orders"
          element={<SellerOrders />}
        />
        <Route
          path="/seller/products"
          element={<SellerProducts />}
        />
         <Route
    path="/seller/products/add"
    element={<AddProduct />}
  />
  <Route
    path="/seller/products/edit/:id"
    element={<EditProduct />}
  />

  //Admin routes
  <Route
    path="/admin"
    element={<AdminDashboard />}
  />
  <Route
    path="/admin/contacts"
    element={<AdminContacts />}
  />

  <Route
    path="/admin/users"
    element={<AdminUsers />}
  />

  <Route
    path="/admin/sellers"
    element={<AdminSellers />}
  />

  <Route
    path="/admin/products"
    element={<AdminProducts />}
  />

  <Route
    path="/admin/orders"
    element={<AdminOrders />}
  />

  <Route
  path="/admin/payments"
  element={<AdminPayments />}
/>

      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default AppRoutes;