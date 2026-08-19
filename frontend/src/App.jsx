import AppRoutes from "./routes/appRoutes";

import { CartProvider } from "./context/cartContext";
import { WishlistProvider } from "./context/wishlistContext";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <AuthProvider>

      <CartProvider>

        <WishlistProvider>

          <AppRoutes />

        </WishlistProvider>

      </CartProvider>

    </AuthProvider>
  );
}

export default App;