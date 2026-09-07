import { useEffect, useState } from "react";
import api from "../utils/api";

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    category: "base",
    quantity: "",
    threshold: "",
    unit: "pieces"
  });

  const fetchInventory = async () => {
    try {
      const response = await api.get("/inventory");
      setInventory(response.data.inventory);
    } catch (error) {
      console.error("FETCH INVENTORY ERROR:", error);
      alert(error.response?.data?.message || "Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      await api.post("/inventory", {
        name: formData.name,
        category: formData.category,
        quantity: Number(formData.quantity),
        threshold: Number(formData.threshold),
        unit: formData.unit
      });

      alert("Inventory item added successfully");

      setFormData({
        name: "",
        category: "base",
        quantity: "",
        threshold: "",
        unit: "pieces"
      });

      fetchInventory();
    } catch (error) {
      console.error("ADD INVENTORY ERROR:", error);
      alert(error.response?.data?.message || "Failed to add inventory");
    }
  };

  const handleUpdate = async (id, quantity, threshold) => {
    try {
      await api.patch(`/inventory/${id}`, {
        quantity: Number(quantity),
        threshold: Number(threshold)
      });

      alert("Inventory updated successfully");

      fetchInventory();
    } catch (error) {
      console.error("UPDATE INVENTORY ERROR:", error);
      alert(error.response?.data?.message || "Failed to update inventory");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inventory item?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/inventory/${id}`);

      alert("Inventory item deleted successfully");

      fetchInventory();
    } catch (error) {
      console.error("DELETE INVENTORY ERROR:", error);
      alert(error.response?.data?.message || "Failed to delete inventory");
    }
  };

  if (loading) {
    return <h2>Loading inventory...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Inventory Management</h1>

      {/* ADD INVENTORY */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Add Inventory Item</h2>

        <form onSubmit={handleAdd}>
          <input
            type="text"
            name="name"
            placeholder="Item name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="base">Base</option>
            <option value="sauce">Sauce</option>
            <option value="cheese">Cheese</option>
            <option value="vegetable">Vegetable</option>
          </select>

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="threshold"
            placeholder="Low stock threshold"
            min="0"
            value={formData.threshold}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="unit"
            placeholder="Unit"
            value={formData.unit}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Add Item
          </button>
        </form>
      </div>

      {/* INVENTORY TABLE */}
      <div>
        <h2>Current Inventory</h2>

        {inventory.length === 0 ? (
          <p>No inventory items found.</p>
        ) : (
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Threshold</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {inventory.map((item) => {
                const isLowStock = item.quantity <= item.threshold;

                return (
                  <tr key={item._id}>
                    <td>{item.name}</td>

                    <td>{item.category}</td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        defaultValue={item.quantity}
                        id={`quantity-${item._id}`}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        defaultValue={item.threshold}
                        id={`threshold-${item._id}`}
                      />
                    </td>

                    <td>{item.unit}</td>

                    <td>
                      {isLowStock ? (
                        <strong>⚠️ Low Stock</strong>
                      ) : (
                        <strong>✅ In Stock</strong>
                      )}
                    </td>

                    <td>
                      <button
                        onClick={() => {
                          const quantity = document.getElementById(
                            `quantity-${item._id}`
                          ).value;

                          const threshold = document.getElementById(
                            `threshold-${item._id}`
                          ).value;

                          handleUpdate(
                            item._id,
                            quantity,
                            threshold
                          );
                        }}
                      >
                        Update
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminInventory;