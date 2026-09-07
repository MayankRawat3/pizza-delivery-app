import api from "../utils/api";

// ========================================
// CREATE ORDER
// ========================================

export const createOrder = async (orderData) => {
  const response = await api.post(
    "/orders",
    orderData
  );

  return response.data;
};

// ========================================
// GET MY ORDERS
// ========================================

export const getMyOrders = async () => {
  const response = await api.get(
    "/orders/my-orders"
  );

  return response.data;
};

// ========================================
// GET SINGLE ORDER
// ========================================

export const getOrderById = async (id) => {
  const response = await api.get(
    `/orders/${id}`
  );
  return response.data;
};



export const cancelOrder = async (id) => {
  const response = await api.patch(
    `/orders/${id}/cancel`
  );

  return response.data;
};
