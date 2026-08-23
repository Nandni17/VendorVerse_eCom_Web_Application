import { Search, X } from "../icons";

function SearchBar({ search, setSearch }) {
  return (
    <div className="search-wrapper">

      {/* =========================
          SEARCH ICON
      ========================= */}

      <Search
        className="search-icon"
        size={18}
        strokeWidth={1.8}
      />


      {/* =========================
          SEARCH INPUT
      ========================= */}

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />


      {/* =========================
          CLEAR SEARCH
      ========================= */}

      {search && (
        <button
          type="button"
          className="clear-search"
          onClick={() => setSearch("")}
          aria-label="Clear search"
        >
          <X
            size={17}
            strokeWidth={1.8}
          />
        </button>
      )}

    </div>
  );
}

export default SearchBar;