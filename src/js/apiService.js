import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;

const removeSession = () => {
  localStorage.removeItem("user");
  window.location.replace("/login?message=session_expired");
};

const refreshToken = async () => {
  if (isRefreshing) return;
  isRefreshing = true;
  try {
    const response = await apiClient.patch("/users/refresh-access-token");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) removeSession();
    throw error;
  } finally {
    isRefreshing = false;
  }
};

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshToken();
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    console.error(error.response?.data);
    return Promise.reject(error);
  }
);

// API Services

export const TodoService = {
  fetchTodos: async () => await apiClient.get("/todos"),
  addTodo: async (text, dueTime) =>
    await apiClient.post("/todos/add", { text, dueTime }),
  updateTodo: async (id, text, dueTime) =>
    await apiClient.put(`/todos/update/${id}`, { text, dueTime }),
  toggleTodoStatus: async (id, status) =>
    await apiClient.patch(`/todos/status/${id}`, { status }),
  deleteTodo: async (id) => await apiClient.delete(`/todos/delete/${id}`),
};

export const AuthService = {
  registerUser: async (name, email, password) =>
    await apiClient.post("/users/register", { name, email, password }),
  loginUser: async (email, password) =>
    await apiClient.post("/users/login", { email, password }),
  logoutUser: async () => await apiClient.post("/users/logout"),
  deleteUser: async (password) =>
    await apiClient.delete("/users/delete", { data: { password } }),
};
