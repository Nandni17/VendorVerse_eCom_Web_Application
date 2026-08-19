function CategoryFilter({ category, setCategory }) {
  const categories = [
    "All",
    "Smartphones",
    "Laptops",
    "Accessories",
    "Wearables",
    "Gaming",
  ];

  return (
    <div className="category-filter">
      {categories.map((item) => (
        <button
          key={item}
          className={category === item ? "active" : ""}
          onClick={() => setCategory(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;