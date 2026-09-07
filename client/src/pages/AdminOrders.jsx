import { useEffect, useState } from "react";
import api from "../utils/api";

const statuses = [
  "confirmed",
  "preparing",
  "out-for-delivery",
  "delivered",
  "cancelled"
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/orders/admin/all"
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error(
        "❌ ADMIN ORDERS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to fetch orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      await api.patch(
        `/orders/admin/${orderId}/status`,
        {
          status
        }
      );

      // Refresh orders after update
      fetchOrders();

    } catch (error) {
      console.error(
        "❌ STATUS UPDATE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update order status."
      );
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >
        <h2>
          Loading orders... ⏳
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >
        <h2>❌ {error}</h2>

        <button
          onClick={fetchOrders}
          style={{
            padding: "10px 20px",
            cursor: "pointer"
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1100px",
        margin: "0 auto"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >
        <h1>
          Admin Orders 📦
        </h1>

        <button
          onClick={fetchOrders}
          style={{
            padding: "10px 18px",
            cursor: "pointer"
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <h2>
          No orders found.
        </h2>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "20px",
              marginTop: "25px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.08)"
            }}
          >
            {/* ORDER HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >
              <div>
                <h2>
                  Order #{order._id.slice(-6)}
                </h2>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    order.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              {/* STATUS */}

              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(
                    order._id,
                    e.target.value
                  )
                }
                disabled={
                  order.status === "cancelled"
                }
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <hr />

            {/* CUSTOMER */}

            <h3>
              Customer 👤
            </h3>

            <p>
              <strong>Name:</strong>{" "}
              {order.user?.name || "N/A"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {order.user?.email || "N/A"}
            </p>

            {/* ITEMS */}

            <hr />

            <h3>
              Items 🍕
            </h3>

            {order.items.map(
              (item, index) => (
                <div
                  key={index}
                  style={{
                    border:
                      "1px solid #eee",
                    borderRadius: "8px",
                    padding: "12px",
                    marginTop: "10px"
                  }}
                >
                  <strong>
                    {item.name}
                  </strong>

                  <p>
                    Base: {item.base}
                  </p>

                  <p>
                    Sauce: {item.sauce}
                  </p>

                  <p>
                    Cheese: {item.cheese}
                  </p>

                  <p>
                    Vegetables:{" "}
                    {item.vegetables?.length
                      ? item.vegetables.join(
                          ", "
                        )
                      : "None"}
                  </p>

                  <p>
                    Quantity:{" "}
                    {item.quantity}
                  </p>

                  <p>
                    Price: ₹{item.price}
                  </p>
                </div>
              )
            )}

            {/* PRICE */}

            <hr />

            <h3>
              Payment 💰
            </h3>

            <p>
              Subtotal: ₹
              {order.subtotal}
            </p>

            <p>
              Delivery Fee: ₹
              {order.deliveryFee}
            </p>

            <h2>
              Total: ₹{order.total}
            </h2>

            <p>
              Payment Status:{" "}
              <strong>
                {order.paymentStatus}
              </strong>
            </p>

            {/* DELIVERY ADDRESS */}

            <hr />

            <h3>
              Delivery Address 📍
            </h3>

            <p>
              {order.deliveryAddress?.name}
            </p>

            <p>
              {order.deliveryAddress?.phone}
            </p>

            <p>
              {order.deliveryAddress?.address}
            </p>

            <p>
              {order.deliveryAddress?.city} -{" "}
              {order.deliveryAddress?.pincode}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;