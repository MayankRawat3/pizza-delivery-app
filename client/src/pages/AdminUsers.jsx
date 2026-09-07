import { useEffect, useState } from "react";
import api from "../utils/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/admin/all");

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("❌ FETCH USERS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to fetch users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  // ==========================================
  // UPDATE USER ROLE
  // ==========================================

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(
        `/users/admin/${userId}/role`,
        {
          role: newRole
        }
      );

      alert("User role updated successfully ✅");

      fetchUsers();
    } catch (error) {
      console.error(
        "❌ UPDATE ROLE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update user role."
      );
    }
  };


  // ==========================================
  // ACTIVATE / DEACTIVATE USER
  // ==========================================

  const handleStatusChange = async (
    userId,
    currentStatus
  ) => {
    const newStatus = !currentStatus;

    const action = newStatus
      ? "activate"
      : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this user?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.patch(
        `/users/admin/${userId}/status`,
        {
          isActive: newStatus
        }
      );

      alert(
        newStatus
          ? "User activated successfully ✅"
          : "User deactivated successfully ✅"
      );

      fetchUsers();
    } catch (error) {
      console.error(
        "❌ UPDATE STATUS ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update user status."
      );
    }
  };


  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDelete = async (userId, userName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${userName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/users/admin/${userId}`
      );

      alert("User deleted successfully ✅");

      fetchUsers();
    } catch (error) {
      console.error(
        "❌ DELETE USER ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading users...</h2>
      </div>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>👥 User Management</h1>

        <p style={{ color: "red" }}>
          {error}
        </p>

        <button onClick={fetchUsers}>
          Try Again
        </button>
      </div>
    );
  }


  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}
    >

      <h1>👥 User Management</h1>

      <p>
        Manage registered users,
        their roles and account status.
      </p>


      <div
        style={{
          marginTop: "30px",
          overflowX: "auto"
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "1100px"
          }}
        >

          <thead>

            <tr>

              <th style={thStyle}>
                Name
              </th>

              <th style={thStyle}>
                Email
              </th>

              <th style={thStyle}>
                Role
              </th>

              <th style={thStyle}>
                Verification
              </th>

              <th style={thStyle}>
                Status
              </th>

              <th style={thStyle}>
                Registered
              </th>

              <th style={thStyle}>
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {users.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "30px"
                  }}
                >
                  No users found.
                </td>

              </tr>

            ) : (

              users.map((user) => (

                <tr key={user._id}>

                  {/* NAME */}

                  <td style={tdStyle}>
                    {user.name}
                  </td>


                  {/* EMAIL */}

                  <td style={tdStyle}>
                    {user.email}
                  </td>


                  {/* ROLE */}

                  <td style={tdStyle}>

                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(
                          user._id,
                          e.target.value
                        )
                      }
                      disabled={
                        user.role === "admin"
                      }
                      style={{
                        padding: "6px",
                        borderRadius: "6px"
                      }}
                    >

                      <option value="user">
                        User
                      </option>

                      <option value="admin">
                        Admin
                      </option>

                    </select>

                  </td>


                  {/* VERIFICATION */}

                  <td style={tdStyle}>

                    {user.isVerified ? (
                      <span>
                        ✅ Verified
                      </span>
                    ) : (
                      <span>
                        ❌ Not Verified
                      </span>
                    )}

                  </td>


                  {/* STATUS */}

                  <td style={tdStyle}>

                    {user.isActive ? (
                      <span>
                        🟢 Active
                      </span>
                    ) : (
                      <span>
                        🔴 Inactive
                      </span>
                    )}

                  </td>


                  {/* REGISTERED */}

                  <td style={tdStyle}>

                    {user.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString()
                      : "N/A"}

                  </td>


                  {/* ACTIONS */}

                  <td style={tdStyle}>

                    <button
                      onClick={() =>
                        handleStatusChange(
                          user._id,
                          user.isActive
                        )
                      }
                      style={{
                        marginRight: "8px",
                        padding: "7px 12px",
                        cursor: "pointer"
                      }}
                    >

                      {user.isActive
                        ? "Deactivate"
                        : "Activate"}

                    </button>


                    <button
                      onClick={() =>
                        handleDelete(
                          user._id,
                          user.name
                        )
                      }
                      style={{
                        padding: "7px 12px",
                        cursor: "pointer"
                      }}
                    >

                      🗑️ Delete

                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};


// ==========================================
// TABLE STYLES
// ==========================================

const thStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "left",
  background: "#f5f5f5"
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "12px"
};


export default AdminUsers;

