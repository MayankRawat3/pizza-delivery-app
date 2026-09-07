import api from "../utils/api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email
  });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post(
    `/auth/reset-password/${token}`,
    { password }
  );

  return response.data;
};