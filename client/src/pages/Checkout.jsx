import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../utils/api";

const Checkout = () => {
  const {
    cart,
    totalPrice,
    clearCart
  } = useCart();

  // DELIVERY ADDRESS
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  // DELIVERY FEE
  const deliveryFee = 40;

  // FINAL TOTAL
  const finalTotal = totalPrice + deliveryFee;

  // HANDLE ADDRESS CHANGE
  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setDeliveryAddress((previousAddress) => ({
      ...previousAddress,
      [name]: value
    }));
  };

  // ========================================
  // HANDLE PAYMENT
  // ========================================

  const handlePayment = async () => {
    
    // ========================================
    // ADDRESS VALIDATION
    // ========================================

    if (
      !deliveryAddress.name ||
      !deliveryAddress.phone ||
      !deliveryAddress.address ||
      !deliveryAddress.city ||
      !deliveryAddress.pincode
    ) {
      alert("Please fill all delivery details.");
      return;
    }

    try {
      // ========================================
      // STEP 1: CHECK INVENTORY BEFORE PAYMENT
      // ========================================


      try {
        const inventoryResponse = await api.post(
          "/inventory/check",
          {
            items: cart
          }
        );

        

      } catch (inventoryError) {
        console.error(
          "❌ INVENTORY CHECK FAILED:",
          inventoryError.response?.data ||
            inventoryError.message
        );

        const message =
          inventoryError.response?.data?.message ||
          "Some items are out of stock.";

        alert(message);

        // IMPORTANT:
        // Razorpay payment will NOT start.
        return;
      }

      // ========================================
      // STEP 2: CREATE RAZORPAY ORDER
      // ========================================


      const response = await api.post(
        "/payment/create-order",
        {
          amount: finalTotal
        }
      );

      

      const razorpayOrder = response.data.order;

      if (!razorpayOrder || !razorpayOrder.id) {
        console.error(
          "❌ Invalid Razorpay order:",
          razorpayOrder
        );

        alert("Razorpay order creation failed.");
        return;
      }

      

      // ========================================
      // STEP 3: RAZORPAY CHECKOUT
      // ========================================

      const options = {
        key: "rzp_test_TXDLegunZTt8LV",

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "Pizza Delivery",

        description: "Pizza Order",

        order_id: razorpayOrder.id,

        // ========================================
        // STEP 4: PAYMENT SUCCESS
        // ========================================

        handler: async function (paymentResponse) {
          
          try {
            // ========================================
            // STEP 5: VERIFY PAYMENT
            // ========================================

            

            const verifyResponse = await api.post(
              "/payment/verify-payment",
              {
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature
              }
            );

           

            // ========================================
            // STEP 6: IF PAYMENT VERIFIED
            // CREATE ACTUAL ORDER
            // ========================================

            if (verifyResponse.data.success) {
             

              const orderResponse = await api.post(
                "/orders",
                {
                  items: cart,

                  deliveryAddress,

                  subtotal: totalPrice,

                  deliveryFee,

                  total: finalTotal,

                  razorpayOrderId:
                    paymentResponse.razorpay_order_id,

                  razorpayPaymentId:
                    paymentResponse.razorpay_payment_id
                }
              );

            

              // ========================================
              // STEP 7: CLEAR CART
              // ========================================

              clearCart();

              

              alert(
                "Order placed successfully! 🎉"
              );

            } else {
              alert(
                "Payment verification failed."
              );
            }

          } catch (error) {
            console.error(
              "❌ ORDER CREATION ERROR:",
              error
            );

            if (error.response) {
              console.error(
                "❌ Status:",
                error.response.status
              );

              console.error(
                "❌ Response:",
                error.response.data
              );

              console.error(
                "❌ MESSAGE:",
                error.response.data?.message
              );
            }

            alert(
              "Payment was successful but order creation failed. Please contact support."
            );
          }
        },

        // ========================================
        // CUSTOMER DETAILS
        // ========================================

        prefill: {
          name: deliveryAddress.name,

          contact: deliveryAddress.phone
        },

        // ========================================
        // THEME
        // ========================================

        theme: {
          color: "#3399cc"
        }
      };

      // ========================================
      // STEP 8: CHECK RAZORPAY SDK
      // ========================================

      if (!window.Razorpay) {
        console.error(
          "❌ Razorpay SDK not loaded!"
        );

        alert(
          "Razorpay SDK is not loaded. Please refresh the page."
        );

        return;
      }

     

      // ========================================
      // STEP 9: CREATE RAZORPAY INSTANCE
      // ========================================

      const razorpay =
        new window.Razorpay(options);

      // ========================================
      // PAYMENT FAILED
      // ========================================

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "❌ Razorpay Payment Failed:",
            response.error
          );

          alert(
            "Payment failed. Please try again."
          );
        }
      );

    

      // ========================================
      // STEP 10: OPEN RAZORPAY
      // ========================================

      razorpay.open();

    } catch (error) {
      console.error(
        "❌ PAYMENT ERROR:",
        error
      );

      if (error.response) {
        console.error(
          "❌ Status:",
          error.response.status
        );

        console.error(
          "❌ Response:",
          error.response.data
        );

        console.error(
          "❌ Request URL:",
          error.config?.url
        );

        console.error(
          "❌ Base URL:",
          error.config?.baseURL
        );

      } else if (error.request) {
        console.error(
          "❌ Request sent but no response received:",
          error.request
        );

      } else {
        console.error(
          "❌ Error message:",
          error.message
        );
      }

      alert(
        "Unable to start payment. Check console."
      );
    }
  };

  // ========================================
  // EMPTY CART
  // ========================================

  if (cart.length === 0) {
    return (
      <div
        style={{
          padding: "30px",
          textAlign: "center"
        }}
      >
        <h2>
          Your cart is empty 🛒
        </h2>

        <Link to="/custom-pizza">
          <button>
            Build Your Pizza
          </button>
        </Link>
      </div>
    );
  }

  // ========================================
  // CHECKOUT PAGE
  // ========================================

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "800px",
        margin: "0 auto"
      }}
    >
      <h1>
        Checkout 🛒
      </h1>

      {/* ========================================
          DELIVERY ADDRESS
      ======================================== */}

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px"
        }}
      >
        <h2>
          Delivery Address 📍
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={deliveryAddress.name}
          onChange={handleAddressChange}
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            padding: "12px",
            marginTop: "15px"
          }}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={deliveryAddress.phone}
          onChange={handleAddressChange}
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            padding: "12px",
            marginTop: "10px"
          }}
        />

        <textarea
          name="address"
          placeholder="Full Address"
          value={deliveryAddress.address}
          onChange={handleAddressChange}
          rows="4"
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            padding: "12px",
            marginTop: "10px",
            resize: "vertical"
          }}
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={deliveryAddress.city}
          onChange={handleAddressChange}
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            padding: "12px",
            marginTop: "10px"
          }}
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={deliveryAddress.pincode}
          onChange={handleAddressChange}
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            padding: "12px",
            marginTop: "10px"
          }}
        />
      </div>

      {/* ========================================
          ORDER SUMMARY
      ======================================== */}

      <h2
        style={{
          marginTop: "30px"
        }}
      >
        Order Summary 🧾
      </h2>

      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            marginTop: "20px"
          }}
        >
          <h2>
            {item.name}
          </h2>

          <p>
            <strong>Base:</strong>{" "}
            {item.base}
          </p>

          <p>
            <strong>Sauce:</strong>{" "}
            {item.sauce}
          </p>

          <p>
            <strong>Cheese:</strong>{" "}
            {item.cheese}
          </p>

          <p>
            <strong>Vegetables:</strong>{" "}
            {item.vegetables.length > 0
              ? item.vegetables.join(", ")
              : "None"}
          </p>

          <p>
            <strong>Quantity:</strong>{" "}
            {item.quantity}
          </p>

          <p>
            <strong>Price:</strong>{" "}
            ₹{item.price}
          </p>

          <p>
            <strong>Total:</strong>{" "}
            ₹{item.price * item.quantity}
          </p>
        </div>
      ))}

      {/* ========================================
          PRICE DETAILS
      ======================================== */}

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px"
        }}
      >
        <h2>
          Price Details
        </h2>

        <p>
          <strong>
            Subtotal:
          </strong>{" "}
          ₹{totalPrice}
        </p>

        <p>
          <strong>
            Delivery Fee:
          </strong>{" "}
          ₹{deliveryFee}
        </p>

        <hr />

        <h2>
          Final Order Total: ₹{finalTotal}
        </h2>

        <button
          onClick={handlePayment}
          style={{
            padding: "12px 25px",
            marginTop: "10px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;