import { useEffect, useState } from "react";
import API from "../api/axios";

import SearchBar from "../components/searchBar";
import CategoryFilter from "../components/categoryFilter";
import ProductGrid from "../components/productGrid";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await API.get("/api/products");

        setProducts(response.data);
      } catch (err) {
        console.error(err);

        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="products-page">

      <section className="products-header">
        <div>
          <p className="eyebrow">VENDORVERSE SHOP</p>

          <h1>
            Discover products
            <br />
            you'll love.
          </h1>

          <p className="subtitle">
            Explore products from independent sellers
            across VendorVerse.
          </p>
        </div>

        <div className="products-count">
          {filteredProducts.length} products
        </div>
      </section>

      <section className="shop-controls">

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <CategoryFilter
          category={category}
          setCategory={setCategory}
        />

      </section>

      {loading && (
        <p>Loading products...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {!loading && !error && (
        <ProductGrid products={filteredProducts} />
      )}

    </main>
  );
}

export default Products;