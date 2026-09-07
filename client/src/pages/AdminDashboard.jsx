import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "0 auto"
      }}
    >
      <h1>Admin Dashboard 🛠️</h1>

      <p>
        Manage your pizza delivery application
        from here.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "30px"
        }}
      >

        {/* ORDERS */}

        <Link
          to="/admin/orders"
          style={{
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "25px",
              cursor: "pointer"
            }}
          >
            <h2>📦 Manage Orders</h2>

            <p>
              View all customer orders and
              update their status.
            </p>

            <strong>
              Go to Orders →
            </strong>
          </div>
        </Link>


        {/* PRODUCTS */}

        <Link
          to="/admin/products"
          style={{
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "25px",
              cursor: "pointer"
            }}
          >
            <h2>🍕 Manage Products</h2>

            <p>
              Add, edit and delete pizza
              products.
            </p>

            <strong>
              Go to Products →
            </strong>
          </div>
        </Link>


        {/* USERS */}

        <Link
          to="/admin/users"
          style={{
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "25px",
              cursor: "pointer"
            }}
          >
            <h2>👥 Manage Users</h2>

            <p>
              View all registered users and their
              account information.
            </p>

            <strong>
              Go to Users →
            </strong>
          </div>
        </Link>


        {/* INVENTORY */}

        <Link
          to="/admin/inventory"
          style={{
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "25px",
              cursor: "pointer"
            }}
          >
            <h2>📊 Manage Inventory</h2>

            <p>
              Manage stock, quantities and
              low-stock thresholds.
            </p>

            <strong>
              Go to Inventory →
            </strong>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default AdminDashboard;