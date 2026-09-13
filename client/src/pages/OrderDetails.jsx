import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getOrderById } from "../services/orderService.js";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH ORDER

  useEffect(() => {
    let interval;

    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);

        setOrder(data.order);
        setError("");

        setLoading(false);

      } catch (error) {
        console.error(
          "FETCH ORDER DETAILS ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load order"
        );

        setLoading(false);
      }
    };

    // Initial fetch
    fetchOrder();

    // Poll every 5 seconds
    interval = setInterval(() => {
      fetchOrder();
    }, 5000);

    // Cleanup interval
    return () => {
      clearInterval(interval);
    };

  }, [id]);

  // LOADING

  if (loading) {
    return (
      <div>
        <h1>Order Details</h1>
        <p>Loading order...</p>
      </div>
    );
  }

  // ERROR

  if (error) {
    return (
      <div>
        <h1>Order Details</h1>

        <p>{error}</p>

        <Link to="/my-orders">
          ← Back to My Orders
        </Link>
      </div>
    );
  }

  // ORDER NOT FOUND

  if (!order) {
    return (
      <div>
        <h1>Order Details</h1>

        <p>Order not found.</p>

        <Link to="/my-orders">
          ← Back to My Orders
        </Link>
      </div>
    );
  }

  // ORDER DETAILS

  return (
    <div>

      <h1>Order Details</h1>

      <hr />

      <h2>
        Order #{order._id.slice(-6)}
      </h2>

      <p>
        Status: {order.status}
      </p>

      <p>
        Date:{" "}
        {new Date(
          order.createdAt
        ).toLocaleString()}
      </p>

      <hr />

      <h2>Items</h2>

      {order.items.map((item, index) => (
        <div key={index}>

          <h3>{item.name}</h3>

          <p>
            Price: ₹{item.price}
          </p>

          <p>
            Quantity: {item.quantity}
          </p>

          <p>
            Item Total: ₹
            {item.price * item.quantity}
          </p>

          <hr />

        </div>
      ))}

      <h2>Delivery Address</h2>

      <p>
        Name: {order.deliveryAddress.name}
      </p>

      <p>
        Phone: {order.deliveryAddress.phone}
      </p>

      <p>
        Address: {order.deliveryAddress.address}
      </p>

      <p>
        City: {order.deliveryAddress.city}
      </p>

      <p>
        Pincode: {order.deliveryAddress.pincode}
      </p>

      <hr />

      <h2>Payment Summary</h2>

      <p>
        Subtotal: ₹{order.subtotal}
      </p>

      <p>
        Delivery Fee: ₹{order.deliveryFee}
      </p>

      <h2>
        Total: ₹{order.total}
      </h2>

      <br />

      <Link to="/my-orders">
        ← Back to My Orders
      </Link>

    </div>
  );
}

export default OrderDetails;

