import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <h2>Your Cart is Empty 🛒</h2>

        <Link to="/custom-pizza">
          <button style={{ marginTop: "20px", padding: "10px 20px" }}>
            Build Your Pizza
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Cart 🛒</h1>

      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>{item.name}</h2>

          <p>
            <strong>Base:</strong> {item.base}
          </p>

          <p>
            <strong>Sauce:</strong> {item.sauce}
          </p>

          <p>
            <strong>Cheese:</strong> {item.cheese}
          </p>

          <p>
            <strong>Vegetables:</strong>{" "}
            {item.vegetables.length > 0
              ? item.vegetables.join(", ")
              : "None"}
          </p>

          <p>
            <strong>Price:</strong> ₹{item.price}
          </p>

          <div style={{ marginTop: "15px" }}>
            <strong>Quantity: </strong>

            <button
              onClick={() => decreaseQuantity(item.id)}
              style={{ margin: "0 10px", padding: "5px 10px" }}
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() => increaseQuantity(item.id)}
              style={{ margin: "0 10px", padding: "5px 10px" }}
            >
              +
            </button>
          </div>

          <p>
            <strong>Item Total:</strong> ₹{item.price * item.quantity}
          </p>

          <button
            onClick={() => removeFromCart(item.id)}
            style={{
              padding: "8px 15px",
              marginTop: "10px",
            }}
          >
            Remove
          </button>
        </div>
      ))}

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      >
        <h2>Cart Summary</h2>

        <h3>Total Amount: ₹{totalPrice}</h3>

        <Link to="/checkout">
          <button
            style={{
              padding: "10px 20px",
              marginTop: "10px",
            }}
          >
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;