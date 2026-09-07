import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div>
      <img
        src={product.image}
        alt={product.name}
        width="250"
      />

      <h3>{product.name}</h3>

      <p>{product.description}</p>

      <p>₹{product.price}</p>

      <p>{product.category}</p>

      <button onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;