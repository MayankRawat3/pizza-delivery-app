import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div>
      <h1>🎉 Order Placed Successfully!</h1>

      <p>
        Thank you for ordering from Pizza Delivery.
      </p>

      <p>
        Your order has been received and is being processed.
      </p>

      <br />

      <Link to="/dashboard">
        🍕 Order More Pizza
      </Link>

      <br />
      <br />

      <Link to="/profile">
        Go to Profile
      </Link>
    </div>
  );
}

export default OrderSuccess;

