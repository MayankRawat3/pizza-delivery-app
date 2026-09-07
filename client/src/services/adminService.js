import api from "../utils/api";

// GET ALL ORDERS
export const getAllOrders = async () => {
  const response = await api.get("/orders/admin/all");
  return response.data;
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(
    `/orders/admin/${id}/status`,
    { status }
  );

  return response.data;
};

// GET ALL USERS
export const getAllUsers = async () => {
  const response = await api.get("/users/admin/all");
  return response.data;
};