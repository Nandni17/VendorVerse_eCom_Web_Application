import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import API from "../api/axios";

function EditProduct() {
  const { id } = useParams();
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

  const [loadingProduct, setLoadingProduct] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // FETCH CURRENT PRODUCT
  // =========================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        setError("");

        const response = await API.get(
          `/api/products/${id}`
        );

        const product = response.data;

        setFormData({
          name: product.name || "",
          price: product.price ?? "",
          description: product.description || "",
          image: product.image || "",
          category: product.category || "",
          brand: product.brand || "",
          stock: product.stock ?? "",
        });
      } catch (err) {
        console.error(
          "Fetch product error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load product."
        );
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (
        !formData.name.trim() ||
        !formData.price ||
        !formData.image.trim() ||
        !formData.category.trim() ||
        formData.stock === ""
      ) {
        setError(
          "Please fill in all required fields."
        );

        setSaving(false);
        return;
      }

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
        "Updating product:",
        productData
      );

      const response = await API.put(
        `/api/products/${id}`,
        productData
      );

      console.log(
        "Updated product:",
        response.data
      );

      setSuccess(
        "Product updated successfully!"
      );

      setTimeout(() => {
        navigate("/seller/products");
      }, 700);
    } catch (err) {
      console.error(
        "Update product error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loadingProduct) {
    return (
      <main className="seller-edit-product-page">

        <div className="seller-products-status">

          <div className="loader"></div>

          <p>
            Loading product...
          </p>

        </div>

      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error && !formData.name) {
    return (
      <main className="seller-edit-product-page">

        <div className="seller-products-status error">

          <h2>
            Unable to load product
          </h2>

          <p>
            {error}
          </p>

          <Link
            to="/seller/products"
            className="seller-add-product-button"
          >
            ← Back to My Products
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="seller-edit-product-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="seller-add-product-header">

        <div>

          <Link
            to="/seller/products"
            className="seller-back-link"
          >
            ← Back to My Products
          </Link>

          <p className="section-eyebrow">
            SELLER CENTER
          </p>

          <h1>
            Edit Product
          </h1>

          <p>
            Update your product information,
            price, image and stock.
          </p>

        </div>

      </section>


      {/* =========================
          FORM
      ========================= */}

      <section className="seller-product-form-card">

        {error && (
          <div className="seller-form-error">
            {error}
          </div>
        )}

        {success && (
          <div className="seller-form-success">
            {success}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          {/* PRODUCT INFORMATION */}

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
                  Update the basic information.
                </p>

              </div>

            </div>


            <div className="seller-form-group">

              <label>
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>


            <div className="seller-form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
              />

            </div>

          </div>


          {/* PRODUCT DETAILS */}

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
                  Update price, category, brand and stock.
                </p>

              </div>

            </div>


            <div className="seller-form-grid">

              <div className="seller-form-group">

                <label>
                  Price (₹) *
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />

              </div>


              <div className="seller-form-group">

                <label>
                  Stock *
                </label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />

              </div>


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


              <div className="seller-form-group">

                <label>
                  Brand
                </label>

                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>


          {/* IMAGE */}

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
                  Update the product image URL.
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
                required
              />

            </div>


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


          {/* ACTIONS */}

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
              disabled={saving}
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes →"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}

export default EditProduct;