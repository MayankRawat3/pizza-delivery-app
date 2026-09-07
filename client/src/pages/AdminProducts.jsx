import { useEffect, useState } from "react";
import api from "../utils/api";

const categories = [
  "Pizza",
  "Burger",
  "Sides",
  "Drinks",
  "Dessert"
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Pizza",
    isAvailable: true
  });

  // ================================
  // FETCH PRODUCTS
  // ================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/products"
      );

      setProducts(
        response.data.products || []
      );

    } catch (error) {
      console.error(
        "❌ FETCH PRODUCTS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to fetch products."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================================
  // FORM INPUT
  // ================================

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value
    }));
  };

  // ================================
  // RESET FORM
  // ================================

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      category: "Pizza",
      isAvailable: true
    });

    setEditingId(null);
    setShowForm(false);
  };

  // ================================
  // CREATE / UPDATE
  // ================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `/products/${editingId}`,
          {
            ...formData,
            price: Number(formData.price)
          }
        );

        alert(
          "Product updated successfully ✅"
        );

      } else {
        await api.post(
          "/products",
          {
            ...formData,
            price: Number(formData.price)
          }
        );

        alert(
          "Product created successfully ✅"
        );
      }

      resetForm();
      fetchProducts();

    } catch (error) {
      console.error(
        "❌ PRODUCT SAVE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to save product."
      );
    }
  };

  // ================================
  // EDIT
  // ================================

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      isAvailable: product.isAvailable
    });

    setEditingId(product._id);
    setShowForm(true);
  };

  // ================================
  // DELETE
  // ================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/products/${id}`
      );

      alert(
        "Product deleted successfully ✅"
      );

      fetchProducts();

    } catch (error) {
      console.error(
        "❌ DELETE PRODUCT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete product."
      );
    }
  };

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >
        <h2>
          Loading products... ⏳
        </h2>
      </div>
    );
  }

  // ================================
  // UI
  // ================================

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1100px",
        margin: "0 auto"
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >
        <h1>
          Admin Products 🍕
        </h1>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          style={{
            padding: "10px 18px",
            cursor: "pointer"
          }}
        >
          {showForm
            ? "Close Form"
            : "+ Add Product"}
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <p
          style={{
            color: "red"
          }}
        >
          ❌ {error}
        </p>
      )}

      {/* PRODUCT FORM */}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            marginTop: "25px"
          }}
        >
          <h2>
            {editingId
              ? "Edit Product"
              : "Add New Product"}
          </h2>

          {/* NAME */}

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
              boxSizing: "border-box"
            }}
          />

          {/* DESCRIPTION */}

          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
              boxSizing: "border-box"
            }}
          />

          {/* PRICE */}

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
              boxSizing: "border-box"
            }}
          />

          {/* IMAGE */}

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
              boxSizing: "border-box"
            }}
          />

          {/* CATEGORY */}

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px"
            }}
          >
            {categories.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}
          </select>

          {/* AVAILABLE */}

          <label
            style={{
              display: "block",
              marginTop: "15px"
            }}
          >
            <input
              type="checkbox"
              name="isAvailable"
              checked={
                formData.isAvailable
              }
              onChange={handleChange}
            />

            {" "}Available
          </label>

          {/* BUTTONS */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px"
            }}
          >
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                cursor: "pointer"
              }}
            >
              {editingId
                ? "Update Product"
                : "Create Product"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: "10px 20px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* PRODUCTS */}

      <div
        style={{
          marginTop: "30px"
        }}
      >
        {products.length === 0 ? (
          <h2>
            No products found.
          </h2>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                marginTop: "20px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: "20px",
                  flexWrap: "wrap"
                }}
              >
                <div>
                  <h2>
                    {product.name}
                  </h2>

                  <p>
                    {product.description}
                  </p>

                  <p>
                    <strong>
                      Price:
                    </strong>{" "}
                    ₹{product.price}
                  </p>

                  <p>
                    <strong>
                      Category:
                    </strong>{" "}
                    {product.category}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {product.isAvailable
                      ? "Available ✅"
                      : "Unavailable ❌"}
                  </p>
                </div>

                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "150px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px"
                    }}
                  />
                )}
              </div>

              {/* ACTIONS */}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px"
                }}
              >
                <button
                  onClick={() =>
                    handleEdit(product)
                  }
                  style={{
                    padding: "8px 15px",
                    cursor: "pointer"
                  }}
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      product._id
                    )
                  }
                  style={{
                    padding: "8px 15px",
                    cursor: "pointer"
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminProducts;