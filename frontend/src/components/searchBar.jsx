function SearchBar({ search, setSearch }) {
  return (
    <div className="search-wrapper">
      <span className="search-icon">⌕</span>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (
        <button
          className="clear-search"
          onClick={() => setSearch("")}
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;