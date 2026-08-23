import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Plus,
  Check,
} from "../icons";

import API from "../api/axios";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
    brand: "",
    stock: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // =========================
      // BASIC VALIDATION
      // =========================

      if (
        !formData.name.trim() ||
        !formData.price ||
        !formData.image.trim() ||
        !formData.category.trim() ||
        !formData.stock
      ) {
        setError(
          "Please fill in all required fields."
        );

        setLoading(false);
        return;
      }

      // =========================
      // PRODUCT DATA
      // =========================

      const productData = {
        name: formData.name.trim(),

        price: Number(formData.price),

        description:
          formData.description.trim(),

        image: formData.image.trim(),

        category:
          formData.category.trim(),

        brand:
          formData.brand.trim(),

        stock: Number(formData.stock),
      };

      console.log(
        "Creating product:",
        productData
      );

      // =========================
      // CREATE PRODUCT
      // =========================

      const response = await API.post(
        "/api/products",
        productData
      );

      console.log(
        "Product created:",
        response.data
      );

      setSuccess(
        "Product added successfully!"
      );

      // =========================
      // REDIRECT
      // =========================

      setTimeout(() => {
        navigate("/seller/products");
      }, 700);

    } catch (err) {
      console.error(
        "Add product error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="seller-add-product-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="seller-add-product-header">

        <div>

          <Link
            to="/seller/products"
            className="seller-back-link"
          >
            <ArrowLeft
              size={17}
              strokeWidth={1.8}
            />

            <span>
              Back to My Products
            </span>
          </Link>


          <p className="section-eyebrow">
            SELLER CENTER
          </p>


          <h1>
            Add Product
          </h1>


          <p>
            Add a new product to your
            VendorVerse store.
          </p>

        </div>

      </section>


      {/* =========================
          FORM
      ========================= */}

      <section className="seller-product-form-card">

        {/* ERROR */}

        {error && (
          <div className="seller-form-error">
            {error}
          </div>
        )}


        {/* SUCCESS */}

        {success && (
          <div className="seller-form-success">

            <Check
              size={17}
              strokeWidth={2}
            />

            <span>
              {success}
            </span>

          </div>
        )}


        <form onSubmit={handleSubmit}>

          {/* =========================
              BASIC INFORMATION
          ========================= */}

          <div className="seller-form-section">

            <div className="seller-form-section-title">

              <span>
                01
              </span>

              <div>

                <h2>
                  Product Information
                </h2>

                <p>
                  Tell customers about your product.
                </p>

              </div>

            </div>


            {/* PRODUCT NAME */}

            <div className="seller-form-group">

              <label>
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. MacBook Air M3"
                required
              />

            </div>


            {/* DESCRIPTION */}

            <div className="seller-form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows="5"
              />

            </div>

          </div>


          {/* =========================
              PRODUCT DETAILS
          ========================= */}

          <div className="seller-form-section">

            <div className="seller-form-section-title">

              <span>
                02
              </span>

              <div>

                <h2>
                  Product Details
                </h2>

                <p>
                  Set price, category and stock.
                </p>

              </div>

            </div>


            <div className="seller-form-grid">

              {/* PRICE */}

              <div className="seller-form-group">

                <label>
                  Price (₹) *
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="120000"
                  min="0"
                  step="0.01"
                  required
                />

              </div>


              {/* STOCK */}

              <div className="seller-form-group">

                <label>
                  Stock *
                </label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="20"
                  min="0"
                  required
                />

              </div>


              {/* CATEGORY */}

              <div className="seller-form-group">

                <label>
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select category
                  </option>

                  <option value="Smartphones">
                    Smartphones
                  </option>

                  <option value="Laptops">
                    Laptops
                  </option>

                  <option value="Wearables">
                    Wearables
                  </option>

                  <option value="Gaming">
                    Gaming
                  </option>

                  <option value="Shoes">
                    Shoes
                  </option>

                  <option value="Mens Clothing">
                    Mens Clothing
                  </option>

                  <option value="Womens Clothing">
                    Womens Clothing
                  </option>

                  <option value="Mens Accessories">
                    Mens Accessories
                  </option>

                  <option value="Womens Accessories">
                    Womens Accessories
                  </option>

                  <option value="Kids Accessories">
                    Kids Accessories
                  </option>

                  <option value="Makeup">
                    Makeup
                  </option>

                  <option value="Perfumes">
                    Perfumes
                  </option>

                  <option value="Furniture">
                    Furniture
                  </option>

                  <option value="Home Decor">
                    Home Decor
                  </option>

                  <option value="Novels">
                    Novels
                  </option>

                </select>

              </div>


              {/* BRAND */}

              <div className="seller-form-group">

                <label>
                  Brand
                </label>

                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Apple"
                />

              </div>

            </div>

          </div>


          {/* =========================
              IMAGE
          ========================= */}

          <div className="seller-form-section">

            <div className="seller-form-section-title">

              <span>
                03
              </span>

              <div>

                <h2>
                  Product Image
                </h2>

                <p>
                  Add a public image URL for your product.
                </p>

              </div>

            </div>


            <div className="seller-form-group">

              <label>
                Image URL *
              </label>

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                required
              />

            </div>


            {/* IMAGE PREVIEW */}

            {formData.image && (
              <div className="seller-image-preview">

                <img
                  src={formData.image}
                  alt="Product preview"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />

              </div>
            )}

          </div>


          {/* =========================
              ACTIONS
          ========================= */}

          <div className="seller-form-actions">

            <Link
              to="/seller/products"
              className="seller-cancel-button"
            >
              Cancel
            </Link>


            <button
              type="submit"
              className="seller-submit-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="button-loader"></span>

                  <span>
                    Adding Product...
                  </span>
                </>
              ) : (
                <>
                  <Plus
                    size={17}
                    strokeWidth={1.8}
                  />

                  <span>
                    Add Product
                  </span>
                </>
              )}

            </button>

          </div>

        </form>

      </section>

    </main>
  );
}

export default AddProduct;