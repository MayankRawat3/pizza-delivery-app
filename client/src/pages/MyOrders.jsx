import { useEffect, useState } from "react";
import api from "../utils/api";

const statusSteps = [
  {
    key: "confirmed",
    label: "Order Confirmed",
    icon: "📦"
  },
  {
    key: "preparing",
    label: "Preparing",
    icon: "👨‍🍳"
  },
  {
    key: "out-for-delivery",
    label: "Out for Delivery",
    icon: "🛵"
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: "✅"
  }
];

const getStatusIndex = (status) => {
  return statusSteps.findIndex(
    (step) => step.key === status
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/orders/my-orders"
      );

      setOrders(response.data.orders || []);

    } catch (error) {
      console.error(
        "❌ FETCH ORDERS ERROR:",
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

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >
        <h2>Loading your orders... ⏳</h2>
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

  if (orders.length === 0) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >
        <h1>My Orders 📦</h1>

        <h2>
          You haven't placed any orders yet.
        </h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "0 auto"
      }}
    >
      <h1>My Orders 📦</h1>

      {orders.map((order) => {
        const currentIndex = getStatusIndex(
          order.status
        );

        const isCancelled =
          order.status === "cancelled";

        return (
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
              <h2>
                Order #{order._id.slice(-6)}
              </h2>

              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  backgroundColor:
                    isCancelled
                      ? "#ffebee"
                      : "#e8f5e9",
                  color:
                    isCancelled
                      ? "#c62828"
                      : "#2e7d32",
                  fontWeight: "bold"
                }}
              >
                {order.status}
              </span>
            </div>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(
                order.createdAt
              ).toLocaleString()}
            </p>

            {/* ORDER TRACKING */}

            <hr />

            <h3>
              Order Tracking 🚚
            </h3>

            {isCancelled ? (
              <div
                style={{
                  padding: "15px",
                  borderRadius: "8px",
                  backgroundColor: "#ffebee",
                  color: "#c62828",
                  fontWeight: "bold"
                }}
              >
                ❌ This order has been cancelled.
              </div>
            ) : (
              <div
                style={{
                  marginTop: "20px"
                }}
              >
                {statusSteps.map(
                  (step, index) => {

                    const completed =
                      currentIndex >= index;

                    const active =
                      currentIndex === index;

                    return (
                      <div
                        key={step.key}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          marginBottom:
                            index !==
                            statusSteps.length - 1
                              ? "20px"
                              : "0"
                        }}
                      >

                        {/* ICON */}

                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",

                            backgroundColor:
                              completed
                                ? "#4caf50"
                                : "#e0e0e0",

                            color:
                              completed
                                ? "white"
                                : "#777",

                            fontSize: "18px",

                            flexShrink: 0
                          }}
                        >
                          {step.icon}
                        </div>

                        {/* TEXT */}

                        <div
                          style={{
                            marginLeft: "15px"
                          }}
                        >
                          <strong
                            style={{
                              color: active
                                ? "#2e7d32"
                                : completed
                                ? "#555"
                                : "#999"
                            }}
                          >
                            {step.label}
                          </strong>

                          {active && (
                            <p
                              style={{
                                margin:
                                  "5px 0 0",
                                color: "#666"
                              }}
                            >
                              Current status
                            </p>
                          )}
                        </div>

                      </div>
                    );
                  }
                )}
              </div>
            )}

            {/* ITEMS */}

            <hr />

            <h3>Items 🍕</h3>

            {order.items.map(
              (item, index) => (
                <div
                  key={index}
                  style={{
                    padding: "15px",
                    marginTop: "10px",
                    border:
                      "1px solid #eee",
                    borderRadius: "8px"
                  }}
                >
                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    <strong>
                      Base:
                    </strong>{" "}
                    {item.base}
                  </p>

                  <p>
                    <strong>
                      Sauce:
                    </strong>{" "}
                    {item.sauce}
                  </p>

                  <p>
                    <strong>
                      Cheese:
                    </strong>{" "}
                    {item.cheese}
                  </p>

                  <p>
                    <strong>
                      Vegetables:
                    </strong>{" "}
                    {item.vegetables?.length >
                    0
                      ? item.vegetables.join(
                          ", "
                        )
                      : "None"}
                  </p>

                  <p>
                    <strong>
                      Quantity:
                    </strong>{" "}
                    {item.quantity}
                  </p>

                  <p>
                    <strong>
                      Price:
                    </strong>{" "}
                    ₹{item.price}
                  </p>
                </div>
              )
            )}

            {/* PRICE */}

            <hr />

            <h3>
              Price Details 💰
            </h3>

            <p>
              <strong>
                Subtotal:
              </strong>{" "}
              ₹{order.subtotal}
            </p>

            <p>
              <strong>
                Delivery Fee:
              </strong>{" "}
              ₹{order.deliveryFee}
            </p>

            <h2>
              Total: ₹{order.total}
            </h2>

            <p>
              <strong>
                Payment:
              </strong>{" "}
              {order.paymentStatus ===
              "paid"
                ? "PAID ✅"
                : order.paymentStatus}
            </p>

            {/* ADDRESS */}

            <hr />

            <h3>
              Delivery Address 📍
            </h3>

            <p>
              {order.deliveryAddress.name}
            </p>

            <p>
              {order.deliveryAddress.phone}
            </p>

            <p>
              {order.deliveryAddress.address}
            </p>

            <p>
              {order.deliveryAddress.city} -{" "}
              {order.deliveryAddress.pincode}
            </p>

          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;