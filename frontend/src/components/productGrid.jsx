import ProductCard from "./productCard";

function ProductGrid({ products }) {

  if (!products || products.length === 0) {
    return (
      <div className="empty-products">
        <h2>No products found</h2>
        <p>Try searching for something else.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">

      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}

    </div>
  );
}

export default ProductGrid;